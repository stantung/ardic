/*
 *  jQuery selectBox - A cosmetic, styleable replacement for SELECT elements
 *
 *  Copyright 2012 Cory LaViska for A Beautiful Site, LLC.
 *
 *  https://github.com/claviska/jquery-selectBox
 *
 *  Licensed under both the MIT license and the GNU GPLv2 (same as jQuery: http://jquery.org/license)
 *
 */
if(jQuery) (function($) {

	$.extend($.fn, {

		selectBox: function(method, data) {

			var typeTimer,
				typeSearch = '',
				isMac = navigator.platform.match(/mac/i);

			//
			// Private methods
			//

			var init = function(select, data) {
				
				var options;
				
				// Disable for iOS devices (their native controls are more suitable for a touch device)
				if( navigator.userAgent.match(/iPad|iPhone|Android|IEMobile|BlackBerry/i) ) return false;

				// Element must be a select control
				if( select.tagName.toLowerCase() !== 'select' ) return false;

				select = $(select);
				if( select.data('selectBox-control') ) return false;

				var control = $('<a class="selectBox" />'),
					inline = select.attr('multiple') || parseInt(select.attr('size')) > 1;

				var settings = data || {};
				
				control
					.width(select.outerWidth())
					.addClass(select.attr('class'))
					.attr('title', select.attr('title') || '')
					.attr('tabindex', parseInt(select.attr('tabindex')))
					.css('display', 'inline-block')
					.bind('focus.selectBox', function() {
						if( this !== document.activeElement && document.body !== document.activeElement ) $(document.activeElement).blur();
						if( control.hasClass('selectBox-active') ) return;
						control.addClass('selectBox-active');
						select.trigger('focus');
					})
					.bind('blur.selectBox', function() {
						if( !control.hasClass('selectBox-active') ) return;
						control.removeClass('selectBox-active');
						select.trigger('blur');
					});
				
				if( !$(window).data('selectBox-bindings') ) {
					$(window)
						.data('selectBox-bindings', true)
						.bind('scroll.selectBox', hideMenus)
						.bind('resize.selectBox', hideMenus);
				}
				
				if( select.attr('disabled') ) control.addClass('selectBox-disabled');
				
				// Focus on control when label is clicked
				select.bind('click.selectBox', function(event) {
					control.focus();
					event.preventDefault();
				});

				// Generate control
				if( inline ) {

					//
					// Inline controls
					//
					options = getOptions(select, 'inline');

					control
						.append(options)
						.data('selectBox-options', options)
						.addClass('selectBox-inline selectBox-menuShowing')
						.bind('keydown.selectBox', function(event) {
							handleKeyDown(select, event);
						})
						.bind('keypress.selectBox', function(event) {
							handleKeyPress(select, event);
						})
						.bind('mousedown.selectBox', function(event) {
							if( $(event.target).is('A.selectBox-inline') ) event.preventDefault();
							if( !control.hasClass('selectBox-focus') ) control.focus();
						})
						.insertAfter(select);

					// Auto-height based on size attribute
					if( !select[0].style.height ) {

						var size = select.attr('size') ? parseInt(select.attr('size')) : 5;

						// Draw a dummy control off-screen, measure, and remove it
						var tmp = control
							.clone()
							.removeAttr('id')
							.css({
								position: 'absolute',
								top: '-9999em'
							})
							.show()
							.appendTo('body');
						tmp.find('.selectBox-options').html('<li><a>\u00A0</a></li>');
						var optionHeight = parseInt(tmp.find('.selectBox-options A:first').html('&nbsp;').outerHeight());
						tmp.remove();

						control.height(optionHeight * size);

					}

					disableSelection(control);

				} else {

					//
					// Dropdown controls
					//
					var label = $('<span class="selectBox-label" />'),
						arrow = $('<span class="selectBox-arrow" />');
					
					// Update label
					label
						.attr('class', getLabelClass(select))
						.text(getLabelText(select));
					
					options = getOptions(select, 'dropdown');
					options.appendTo('BODY');

					control
						.data('selectBox-options', options)
						.addClass('selectBox-dropdown')
						.append(label)
						.append(arrow)
						.bind('mousedown.selectBox', function(event) {
							if( control.hasClass('selectBox-menuShowing') ) {
								hideMenus();
							} else {
								event.stopPropagation();
								// Webkit fix to prevent premature selection of options
								options.data('selectBox-down-at-x', event.screenX).data('selectBox-down-at-y', event.screenY);
								showMenu(select);
							}
						})
						.bind('keydown.selectBox', function(event) {
							handleKeyDown(select, event);
						})
						.bind('keypress.selectBox', function(event) {
							handleKeyPress(select, event);
						})
						.bind('open.selectBox', function(event, triggerData) {
							if(triggerData && triggerData._selectBox === true) return;
							showMenu(select);
						})
						.bind('close.selectBox', function(event, triggerData) {
							if(triggerData && triggerData._selectBox === true) return;
							hideMenus();
						})						
						.insertAfter(select);
					
					// Set label width
					var labelWidth = control.width() - arrow.outerWidth() - parseInt(label.css('paddingLeft')) - parseInt(label.css('paddingLeft'));
					label.width(labelWidth);
					
					disableSelection(control);
					
				}

				// Store data for later use and show the control
				select
					.addClass('selectBox')
					.data('selectBox-control', control)
					.data('selectBox-settings', settings)
					.hide();
				
			};


			var getOptions = function(select, type) {
				var options;

				// Private function to handle recursion in the getOptions function.
				var _getOptions = function(select, options) {
					// Loop through the set in order of element children.
					select.children('OPTION, OPTGROUP').each( function() {
						// If the element is an option, add it to the list.
						if ($(this).is('OPTION')) {
							// Check for a value in the option found.
							if($(this).length > 0) {
								// Create an option form the found element.
								generateOptions($(this), options);
							}
							else {
								// No option information found, so add an empty.
								options.append('<li>\u00A0</li>');
							}
						}
						else {
							// If the element is an option group, add the group and call this function on it.
							var optgroup = $('<li class="selectBox-optgroup" />');
							optgroup.text($(this).attr('label'));
							options.append(optgroup);
							options = _getOptions($(this), options);
						}
					});
					// Return the built strin
					return options;
				};

				switch( type ) {

					case 'inline':

						options = $('<ul class="selectBox-options" />');
						options = _getOptions(select, options);
						
						options
							.find('A')
								.bind('mouseover.selectBox', function(event) {
									addHover(select, $(this).parent());
								})
								.bind('mouseout.selectBox', function(event) {
									removeHover(select, $(this).parent());
								})
								.bind('mousedown.selectBox', function(event) {
									event.preventDefault(); // Prevent options from being "dragged"
									if( !select.selectBox('control').hasClass('selectBox-active') ) select.selectBox('control').focus();
								})
								.bind('mouseup.selectBox', function(event) {
									hideMenus();
									selectOption(select, $(this).parent(), event);
								});

						disableSelection(options);

						return options;

					case 'dropdown':
						options = $('<ul class="selectBox-dropdown-menu selectBox-options" />');
						options = _getOptions(select, options);

						options
							.data('selectBox-select', select)
							.css('display', 'none')
							.appendTo('BODY')
							.find('A')
								.bind('mousedown.selectBox', function(event) {
									event.preventDefault(); // Prevent options from being "dragged"
									if( event.screenX === options.data('selectBox-down-at-x') && event.screenY === options.data('selectBox-down-at-y') ) {
										options.removeData('selectBox-down-at-x').removeData('selectBox-down-at-y');
										hideMenus();
									}
								})
								.bind('mouseup.selectBox', function(event) {
									if( event.screenX === options.data('selectBox-down-at-x') && event.screenY === options.data('selectBox-down-at-y') ) {
										return;
									} else {
										options.removeData('selectBox-down-at-x').removeData('selectBox-down-at-y');
									}
									selectOption(select, $(this).parent());
									hideMenus();
								}).bind('mouseover.selectBox', function(event) {
									addHover(select, $(this).parent());
								})
								.bind('mouseout.selectBox', function(event) {
									removeHover(select, $(this).parent());
								});
						
						// Inherit classes for dropdown menu
						var classes = select.attr('class') || '';
						if( classes !== '' ) {
							classes = classes.split(' ');
							for( var i in classes ) options.addClass(classes[i] + '-selectBox-dropdown-menu');
						}

						disableSelection(options);

						return options;

				}

			};
			
			
			var getLabelClass = function(select) {
				var selected = $(select).find('OPTION:selected');
				return ('selectBox-label ' + (selected.attr('class') || '')).replace(/\s+$/, '');
			};
			
			
			var getLabelText = function(select) {
				var selected = $(select).find('OPTION:selected');
				return selected.text() || '\u00A0';
			};
			
			
			var setLabel = function(select) {
				select = $(select);
				var control = select.data('selectBox-control');
				if( !control ) return;
				control.find('.selectBox-label').attr('class', getLabelClass(select)).text(getLabelText(select));
			};
			
			
			var destroy = function(select) {

				select = $(select);
				var control = select.data('selectBox-control');
				if( !control ) return;
				var options = control.data('selectBox-options');

				options.remove();
				control.remove();
				select
					.removeClass('selectBox')
					.removeData('selectBox-control').data('selectBox-control', null)
					.removeData('selectBox-settings').data('selectBox-settings', null)
					.show();

			};
			
			
			var refresh = function(select) {
				select = $(select);
				select.selectBox('options', select.html());
			};

			
			var showMenu = function(select) {

				select = $(select);
				var control = select.data('selectBox-control'),
					settings = select.data('selectBox-settings'),
					options = control.data('selectBox-options');
				if( control.hasClass('selectBox-disabled') ) return false;

				hideMenus();

				var borderBottomWidth = isNaN(control.css('borderBottomWidth')) ? 0 : parseInt(control.css('borderBottomWidth'));
				
				// Menu position
				options
					.width(control.innerWidth())
					.css({
						top: control.offset().top + control.outerHeight() - borderBottomWidth , //control.offset().top - options.outerHeight()
						left: control.offset().left
					});
				
				if( select.triggerHandler('beforeopen') ) return false;
				var dispatchOpenEvent = function() {
					select.triggerHandler('open', { _selectBox: true });
				};
				
				// Show menu
				switch( settings.menuTransition ) {

					case 'fade':
						options.fadeIn(settings.menuSpeed, dispatchOpenEvent);
						break;

					case 'slide':
						options.slideDown(settings.menuSpeed, dispatchOpenEvent);
						break;

					default:
						options.show(settings.menuSpeed, dispatchOpenEvent);
						break;

				}
				
				if( !settings.menuSpeed ) dispatchOpenEvent();
				
				// Center on selected option
				var li = options.find('.selectBox-selected:first');
				keepOptionInView(select, li, true);
				addHover(select, li);

				control.addClass('selectBox-menuShowing');

				$(document).bind('mousedown.selectBox', function(event) {
					if( $(event.target).parents().andSelf().hasClass('selectBox-options') ) return;
					hideMenus();
				});

			};


			var hideMenus = function() {

				if( $(".selectBox-dropdown-menu:visible").length === 0 ) return;
				$(document).unbind('mousedown.selectBox');

				$(".selectBox-dropdown-menu").each( function() {

					var options = $(this),
						select = options.data('selectBox-select'),
						control = select.data('selectBox-control'),
						settings = select.data('selectBox-settings');
					
					if( select.triggerHandler('beforeclose') ) return false;
					
					var dispatchCloseEvent = function() {
						select.triggerHandler('close', { _selectBox: true });
					};					
					
					switch( settings.menuTransition ) {

						case 'fade':
							options.fadeOut(settings.menuSpeed, dispatchCloseEvent);
							break;

						case 'slide':
							options.slideUp(settings.menuSpeed, dispatchCloseEvent);
							break;

						default:
							options.hide(settings.menuSpeed, dispatchCloseEvent);
							break;

					}
					
					if( !settings.menuSpeed ) dispatchCloseEvent();
					
					control.removeClass('selectBox-menuShowing');

				});

			};


			var selectOption = function(select, li, event) {

				select = $(select);
				li = $(li);
				var control = select.data('selectBox-control'),
					settings = select.data('selectBox-settings');

				if( control.hasClass('selectBox-disabled') ) return false;
				if( li.length === 0 || li.hasClass('selectBox-disabled') ) return false;

				if( select.attr('multiple') ) {

					// If event.shiftKey is true, this will select all options between li and the last li selected
					if( event.shiftKey && control.data('selectBox-last-selected') ) {

						li.toggleClass('selectBox-selected');

						var affectedOptions;
						if( li.index() > control.data('selectBox-last-selected').index() ) {
							affectedOptions = li.siblings().slice(control.data('selectBox-last-selected').index(), li.index());
						} else {
							affectedOptions = li.siblings().slice(li.index(), control.data('selectBox-last-selected').index());
						}

						affectedOptions = affectedOptions.not('.selectBox-optgroup, .selectBox-disabled');

						if( li.hasClass('selectBox-selected') ) {
							affectedOptions.addClass('selectBox-selected');
						} else {
							affectedOptions.removeClass('selectBox-selected');
						}

					} else if( (isMac && event.metaKey) || (!isMac && event.ctrlKey) ) {
						li.toggleClass('selectBox-selected');
					} else {
						li.siblings().removeClass('selectBox-selected');
						li.addClass('selectBox-selected');
					}

				} else {
					li.siblings().removeClass('selectBox-selected');
					li.addClass('selectBox-selected');
				}

				if( control.hasClass('selectBox-dropdown') ) {
					control.find('.selectBox-label').text(li.text());
				}
				
				// Update original control's value
				var i = 0, selection = [];
				if( select.attr('multiple') ) {
					control.find('.selectBox-selected A').each( function() {
						selection[i++] = $(this).attr('rel');
					});
				} else {
					selection = li.find('A').attr('rel');
				}
				
				// Remember most recently selected item
				control.data('selectBox-last-selected', li);

				// Change callback
				if( select.val() !== selection ) {
					select.val(selection);
					setLabel(select);
					select.trigger('change');
				}

				return true;

			};


			var addHover = function(select, li) {
				select = $(select);
				li = $(li);
				var control = select.data('selectBox-control'),
					options = control.data('selectBox-options');

				options.find('.selectBox-hover').removeClass('selectBox-hover');
				li.addClass('selectBox-hover');
			};


			var removeHover = function(select, li) {
				select = $(select);
				li = $(li);
				var control = select.data('selectBox-control'),
					options = control.data('selectBox-options');
				options.find('.selectBox-hover').removeClass('selectBox-hover');
			};


			var keepOptionInView = function(select, li, center) {

				if( !li || li.length === 0 ) return;

				select = $(select);
				var control = select.data('selectBox-control'),
					options = control.data('selectBox-options'),
					scrollBox = control.hasClass('selectBox-dropdown') ? options : options.parent(),
					top = parseInt(li.offset().top - scrollBox.position().top),
					bottom = parseInt(top + li.outerHeight());

				if( center ) {
					scrollBox.scrollTop( li.offset().top - scrollBox.offset().top + scrollBox.scrollTop() - (scrollBox.height() / 2) );
				} else {
					if( top < 0 ) {
						scrollBox.scrollTop( li.offset().top - scrollBox.offset().top + scrollBox.scrollTop() );
					}
					if( bottom > scrollBox.height() ) {
						scrollBox.scrollTop( (li.offset().top + li.outerHeight()) - scrollBox.offset().top + scrollBox.scrollTop() - scrollBox.height() );
					}
				}

			};


			var handleKeyDown = function(select, event) {

				//
				// Handles open/close and arrow key functionality
				//

				select = $(select);
				var control = select.data('selectBox-control'),
					options = control.data('selectBox-options'),
					settings = select.data('selectBox-settings'),
					totalOptions = 0,
					i = 0;

				if( control.hasClass('selectBox-disabled') ) return;

				switch( event.keyCode ) {

					case 8: // backspace
						event.preventDefault();
						typeSearch = '';
						break;

					case 9: // tab
					case 27: // esc
						hideMenus();
						removeHover(select);
						break;

					case 13: // enter
						if( control.hasClass('selectBox-menuShowing') ) {
							selectOption(select, options.find('LI.selectBox-hover:first'), event);
							if( control.hasClass('selectBox-dropdown') ) hideMenus();
						} else {
							showMenu(select);
						}
						break;

					case 38: // up
					case 37: // left

						event.preventDefault();

						if( control.hasClass('selectBox-menuShowing') ) {

							var prev = options.find('.selectBox-hover').prev('LI');
							totalOptions = options.find('LI:not(.selectBox-optgroup)').length;
							i = 0;

							while( prev.length === 0 || prev.hasClass('selectBox-disabled') || prev.hasClass('selectBox-optgroup') ) {
								prev = prev.prev('LI');
								if( prev.length === 0 ) {
									if (settings.loopOptions) {
										prev = options.find('LI:last');
									} else {
										prev = options.find('LI:first');
									}
								}
								if( ++i >= totalOptions ) break;
							}

							addHover(select, prev);
							selectOption(select, prev, event);
							keepOptionInView(select, prev);

						} else {
							showMenu(select);
						}

						break;

					case 40: // down
					case 39: // right

						event.preventDefault();

						if( control.hasClass('selectBox-menuShowing') ) {

							var next = options.find('.selectBox-hover').next('LI');
							totalOptions = options.find('LI:not(.selectBox-optgroup)').length;
							i = 0;

							while( next.length === 0 || next.hasClass('selectBox-disabled') || next.hasClass('selectBox-optgroup') ) {
								next = next.next('LI');
								if( next.length === 0 ) {
									if (settings.loopOptions) {
										next = options.find('LI:first');
									} else {
										next = options.find('LI:last');
									}
								}
								if( ++i >= totalOptions ) break;
							}

							addHover(select, next);
							selectOption(select, next, event);
							keepOptionInView(select, next);

						} else {
							showMenu(select);
						}

						break;

				}

			};


			var handleKeyPress = function(select, event) {

				//
				// Handles type-to-find functionality
				//

				select = $(select);
				var control = select.data('selectBox-control'),
					options = control.data('selectBox-options');

				if( control.hasClass('selectBox-disabled') ) return;

				switch( event.keyCode ) {

					case 9: // tab
					case 27: // esc
					case 13: // enter
					case 38: // up
					case 37: // left
					case 40: // down
					case 39: // right
						// Don't interfere with the keydown event!
						break;

					default: // Type to find

						if( !control.hasClass('selectBox-menuShowing') ) showMenu(select);

						event.preventDefault();

						clearTimeout(typeTimer);
						typeSearch += String.fromCharCode(event.charCode || event.keyCode);

						options.find('A').each( function() {
							if( $(this).text().substr(0, typeSearch.length).toLowerCase() === typeSearch.toLowerCase() ) {
								addHover(select, $(this).parent());
								keepOptionInView(select, $(this).parent());
								return false;
							}
						});

						// Clear after a brief pause
						typeTimer = setTimeout( function() { typeSearch = ''; }, 1000);

						break;

				}

			};


			var enable = function(select) {
				select = $(select);
				select.attr('disabled', false);
				var control = select.data('selectBox-control');
				if( !control ) return;
				control.removeClass('selectBox-disabled');
			};


			var disable = function(select) {
				select = $(select);
				select.attr('disabled', true);
				var control = select.data('selectBox-control');
				if( !control ) return;
				control.addClass('selectBox-disabled');
			};


			var setValue = function(select, value) {
				select = $(select);
				select.val(value);
				value = select.val();
				var control = select.data('selectBox-control');
				if( !control ) return;
				var settings = select.data('selectBox-settings'),
					options = control.data('selectBox-options');

				// Update label
				setLabel(select);
				
				// Update control values
				options.find('.selectBox-selected').removeClass('selectBox-selected');
				options.find('A').each( function() {
					if( typeof(value) === 'object' ) {
						for( var i = 0; i < value.length; i++ ) {
							if( $(this).attr('rel') == value[i] ) {
								$(this).parent().addClass('selectBox-selected');
							}
						}
					} else {
						if( $(this).attr('rel') == value ) {
							$(this).parent().addClass('selectBox-selected');
						}
					}
				});

				if( settings.change ) settings.change.call(select);

			};


			var setOptions = function(select, options) {

				select = $(select);
				var control = select.data('selectBox-control'),
					settings = select.data('selectBox-settings');

				switch( typeof(data) ) {

					case 'string':
						select.html(data);
						break;

					case 'object':
						select.html('');
						for( var i in data ) {
							if( data[i] === null ) continue;
							if( typeof(data[i]) === 'object' ) {
								var optgroup = $('<optgroup label="' + i + '" />');
								for( var j in data[i] ) {
									optgroup.append('<option value="' + j + '">' + data[i][j] + '</option>');
								}
								select.append(optgroup);
							} else {
								var option = $('<option value="' + i + '">' + data[i] + '</option>');
								select.append(option);
							}
						}
						break;

				}

				if( !control ) return;

				// Remove old options
				control.data('selectBox-options').remove();

				// Generate new options
				var type = control.hasClass('selectBox-dropdown') ? 'dropdown' : 'inline';
				options = getOptions(select, type);
				control.data('selectBox-options', options);

				switch( type ) {
					case 'inline':
						control.append(options);
						break;
					case 'dropdown':
						// Update label
						setLabel(select);
						$("BODY").append(options);
						break;
				}

			};


			var disableSelection = function(selector) {
				$(selector)
					.css('MozUserSelect', 'none')
					.bind('selectstart', function(event) {
						event.preventDefault();
					});
			};

			var generateOptions = function(self, options){
				var li = $('<li />'),
				a = $('<a />');
				li.addClass( self.attr('class') );
				li.data( self.data() );
				a.attr('rel', self.val()).text( self.text() );
				li.append(a);
				if( self.attr('disabled') ) li.addClass('selectBox-disabled');
				if( self.attr('selected') ) li.addClass('selectBox-selected');
				options.append(li);
			};

			//
			// Public methods
			//

			switch( method ) {

				case 'control':
					return $(this).data('selectBox-control');

				case 'settings':
					if( !data ) return $(this).data('selectBox-settings');
					$(this).each( function() {
						$(this).data('selectBox-settings', $.extend(true, $(this).data('selectBox-settings'), data));
					});
					break;

				case 'options':
					// Getter
					if( data === undefined ) return $(this).data('selectBox-control').data('selectBox-options');
					// Setter
					$(this).each( function() {
						setOptions(this, data);
					});
					break;

				case 'value':
					// Empty string is a valid value
					if( data === undefined ) return $(this).val();
					$(this).each( function() {
						setValue(this, data);
					});
					break;
				
				case 'refresh':
					$(this).each( function() {
						refresh(this);
					});
					break;

				case 'enable':
					$(this).each( function() {
						enable(this);
					});
					break;

				case 'disable':
					$(this).each( function() {
						disable(this);
					});
					break;

				case 'destroy':
					$(this).each( function() {
						destroy(this);
					});
					break;

				default:
					$(this).each( function() {
						init(this, method);
					});
					break;

			}

			return $(this);

		}

	});

})(jQuery);


/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);


(function($){$.fn.jCarouselLite=function(o){o=$.extend({btnPrev:null,btnNext:null,btnGo:null,mouseWheel:false,auto:null,speed:200,easing:null,vertical:false,circular:true,visible:3,start:0,scroll:1,beforeStart:null,afterEnd:null},o||{});return this.each(function(){var b=false,animCss=o.vertical?"top":"left",sizeCss=o.vertical?"height":"width";var c=$(this),ul=$("ul",c),tLi=$("li",ul),tl=tLi.size(),v=o.visible;if(o.circular){ul.prepend(tLi.slice(tl-v-1+1).clone()).append(tLi.slice(0,v).clone());o.start+=v}var f=$("li",ul),itemLength=f.size(),curr=o.start;c.css("visibility","visible");f.css({overflow:"hidden",float:o.vertical?"none":"left"});ul.css({margin:"0",padding:"0",position:"relative","list-style-type":"none","z-index":"1"});c.css({overflow:"hidden",position:"relative","z-index":"2",left:"0px"});var g=o.vertical?height(f):width(f);var h=g*itemLength;var j=g*v;f.css({width:f.width(),height:f.height()});ul.css(sizeCss,h+"px").css(animCss,-(curr*g));c.css(sizeCss,j+"px");if(o.btnPrev)$(o.btnPrev).click(function(){return go(curr-o.scroll)});if(o.btnNext)$(o.btnNext).click(function(){return go(curr+o.scroll)});if(o.btnGo)$.each(o.btnGo,function(i,a){$(a).click(function(){return go(o.circular?o.visible+i:i)})});if(o.mouseWheel&&c.mousewheel)c.mousewheel(function(e,d){return d>0?go(curr-o.scroll):go(curr+o.scroll)});if(o.auto)setInterval(function(){go(curr+o.scroll)},o.auto+o.speed);function vis(){return f.slice(curr).slice(0,v)};function go(a){if(!b){if(o.beforeStart)o.beforeStart.call(this,vis());if(o.circular){if(a<=o.start-v-1){ul.css(animCss,-((itemLength-(v*2))*g)+"px");curr=a==o.start-v-1?itemLength-(v*2)-1:itemLength-(v*2)-o.scroll}else if(a>=itemLength-v+1){ul.css(animCss,-((v)*g)+"px");curr=a==itemLength-v+1?v+1:v+o.scroll}else curr=a}else{if(a<0||a>itemLength-v)return;else curr=a}b=true;ul.animate(animCss=="left"?{left:-(curr*g)}:{top:-(curr*g)},o.speed,o.easing,function(){if(o.afterEnd)o.afterEnd.call(this,vis());b=false});if(!o.circular){$(o.btnPrev+","+o.btnNext).removeClass("disabled");$((curr-o.scroll<0&&o.btnPrev)||(curr+o.scroll>itemLength-v&&o.btnNext)||[]).addClass("disabled")}}return false}})};function css(a,b){return parseInt($.css(a[0],b))||0};function width(a){return a[0].offsetWidth+css(a,'marginLeft')+css(a,'marginRight')};function height(a){return a[0].offsetHeight+css(a,'marginTop')+css(a,'marginBottom')}})(jQuery);


/**
 * @author sole / http://soledadpenades.com
 * @author mr.doob / http://mrdoob.com
 * @author Robert Eisele / http://www.xarg.org
 * @author Philippe / http://philippe.elsass.me
 * @author Robert Penner / http://www.robertpenner.com/easing_terms_of_use.html
 * @author Paul Lewis / http://www.aerotwist.com/
 * @author lechecacharro
 * @author Josh Faul / http://jocafa.com/
 */

var TWEEN = TWEEN || ( function () {

	var i, tl, interval, time, fps = 60, autostart = false, tweens = [], num_tweens;

	return {
	
		setFPS: function ( f ) {

			fps = f || 60;

		},

		start: function ( f ) {
			
			if( arguments.length != 0 ) {
				this.setFPS( f );
			}
			
			interval = setInterval( this.update, 1000 / fps );

		},

		stop: function () {

			clearInterval( interval );

		},

		setAutostart: function ( value ) {

			autostart = value;
			
			if(autostart && !interval) {
				this.start();
			}

		},

		add: function ( tween ) {

			tweens.push( tween );

			if (autostart && !interval) {

				this.start();

			}

		},

		getAll: function() {

			return tweens;

		},

		removeAll: function() {

			tweens = [];

		},

		remove: function ( tween ) {

			i = tweens.indexOf( tween );

			if ( i !== -1 ) {

				tweens.splice( i, 1 );

			}

		},

		update: function (_time) {

			i = 0; num_tweens = tweens.length;
			var time = _time || new Date().getTime();

			while ( i < num_tweens ) {

				if ( tweens[ i ].update( time ) ) {

					i++;

				} else {

					tweens.splice( i, 1 );
					num_tweens--;

				}

			}

			if (num_tweens == 0 && autostart == true) {

				this.stop();

			}

		}

	};

} )();

TWEEN.Tween = function ( object ) {

	var _object = object,
	_valuesStart = {},
	_valuesDelta = {},
	_valuesEnd = {},
	_duration = 1000,
	_delayTime = 0,
	_startTime = null,
	_easingFunction = TWEEN.Easing.Linear.EaseNone,
	_chainedTween = null,
	_onUpdateCallback = null,
	_onCompleteCallback = null;

	this.to = function ( properties, duration ) {

		if( duration !== null ) {

			_duration = duration;

		}

		for ( var property in properties ) {

			// This prevents the engine from interpolating null values
			if ( _object[ property ] === null ) {

				continue;

			}

			// The current values are read when the tween starts;
			// here we only store the final desired values
			_valuesEnd[ property ] = properties[ property ];

		}

		return this;

	};
 
	this.start = function (_time) {

		TWEEN.add( this );

		_startTime = _time ? _time + _delayTime : new Date().getTime() + _delayTime;

		for ( var property in _valuesEnd ) {

			// Again, prevent dealing with null values
			if ( _object[ property ] === null ) {

				continue;

			}

			_valuesStart[ property ] = _object[ property ];
			_valuesDelta[ property ] = _valuesEnd[ property ] - _object[ property ];

		}

		return this;
	};

	this.stop = function () {

		TWEEN.remove( this );
		return this;

	};

	this.delay = function ( amount ) {

		_delayTime = amount;
		return this;

	};

	this.easing = function ( easing ) {

		_easingFunction = easing;
		return this;

	};

	this.chain = function ( chainedTween ) {

		_chainedTween = chainedTween;
		return this;

	};

	this.onUpdate = function ( onUpdateCallback ) {

		_onUpdateCallback = onUpdateCallback;
		return this;

	};

	this.onComplete = function ( onCompleteCallback ) {

		_onCompleteCallback = onCompleteCallback;
		return this;

	};

	this.update = function ( time ) {

		var property, elapsed, value;

		if ( time < _startTime ) {

			return true;

		}

		elapsed = ( time - _startTime ) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value = _easingFunction( elapsed );

		for ( property in _valuesDelta ) {

			_object[ property ] = _valuesStart[ property ] + _valuesDelta[ property ] * value;

		}

		if ( _onUpdateCallback !== null ) {

			_onUpdateCallback.call( _object, value );

		}

		if ( elapsed == 1 ) {

			if ( _onCompleteCallback !== null ) {

				_onCompleteCallback.call( _object );

			}

			if ( _chainedTween !== null ) {

				_chainedTween.start();

			}

			return false;

		}

		return true;

	};

	/*
	this.destroy = function () {

		TWEEN.remove( this );

	};
	*/
}

TWEEN.Easing = { Linear: {}, Quadratic: {}, Cubic: {}, Quartic: {}, Quintic: {}, Sinusoidal: {}, Exponential: {}, Circular: {}, Elastic: {}, Back: {}, Bounce: {} };


TWEEN.Easing.Linear.EaseNone = function ( k ) {

	return k;

};

//

TWEEN.Easing.Quadratic.EaseIn = function ( k ) {

	return k * k;

};

TWEEN.Easing.Quadratic.EaseOut = function ( k ) {

	return - k * ( k - 2 );

};

TWEEN.Easing.Quadratic.EaseInOut = function ( k ) {

	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
	return - 0.5 * ( --k * ( k - 2 ) - 1 );

};

//

TWEEN.Easing.Cubic.EaseIn = function ( k ) {

	return k * k * k;

};

TWEEN.Easing.Cubic.EaseOut = function ( k ) {

	return --k * k * k + 1;

};

TWEEN.Easing.Cubic.EaseInOut = function ( k ) {

	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
	return 0.5 * ( ( k -= 2 ) * k * k + 2 );

};

//

TWEEN.Easing.Quartic.EaseIn = function ( k ) {

	return k * k * k * k;

};

TWEEN.Easing.Quartic.EaseOut = function ( k ) {

	 return - ( --k * k * k * k - 1 );

}

TWEEN.Easing.Quartic.EaseInOut = function ( k ) {

	if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
	return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

};

//

TWEEN.Easing.Quintic.EaseIn = function ( k ) {

	return k * k * k * k * k;

};

TWEEN.Easing.Quintic.EaseOut = function ( k ) {

	return ( k = k - 1 ) * k * k * k * k + 1;

};

TWEEN.Easing.Quintic.EaseInOut = function ( k ) {

	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
	return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

};

// 

TWEEN.Easing.Sinusoidal.EaseIn = function ( k ) {

	return - Math.cos( k * Math.PI / 2 ) + 1;

};

TWEEN.Easing.Sinusoidal.EaseOut = function ( k ) {

	return Math.sin( k * Math.PI / 2 );

};

TWEEN.Easing.Sinusoidal.EaseInOut = function ( k ) {

	return - 0.5 * ( Math.cos( Math.PI * k ) - 1 );

};

//

TWEEN.Easing.Exponential.EaseIn = function ( k ) {

	return k == 0 ? 0 : Math.pow( 2, 10 * ( k - 1 ) );

};

TWEEN.Easing.Exponential.EaseOut = function ( k ) {

	return k == 1 ? 1 : - Math.pow( 2, - 10 * k ) + 1;

};

TWEEN.Easing.Exponential.EaseInOut = function ( k ) {

	if ( k == 0 ) return 0;
        if ( k == 1 ) return 1;
        if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 2, 10 * ( k - 1 ) );
        return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

};

// 

TWEEN.Easing.Circular.EaseIn = function ( k ) {

	return - ( Math.sqrt( 1 - k * k ) - 1);

};

TWEEN.Easing.Circular.EaseOut = function ( k ) {

	return Math.sqrt( 1 - --k * k );

};

TWEEN.Easing.Circular.EaseInOut = function ( k ) {

	if ( ( k /= 0.5 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
	return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

};

//

TWEEN.Easing.Elastic.EaseIn = function( k ) {

	var s, a = 0.1, p = 0.4;
	if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
	return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

};

TWEEN.Easing.Elastic.EaseOut = function( k ) {

	var s, a = 0.1, p = 0.4;
	if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
	return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

};

TWEEN.Easing.Elastic.EaseInOut = function( k ) {

	var s, a = 0.1, p = 0.4;
	if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
        if ( !a || a < 1 ) { a = 1; s = p / 4; }
        else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
        if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
        return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

};

//

TWEEN.Easing.Back.EaseIn = function( k ) {

	var s = 1.70158;
	return k * k * ( ( s + 1 ) * k - s );

};

TWEEN.Easing.Back.EaseOut = function( k ) {

	var s = 1.70158;
	return ( k = k - 1 ) * k * ( ( s + 1 ) * k + s ) + 1;

};

TWEEN.Easing.Back.EaseInOut = function( k ) {

	var s = 1.70158 * 1.525;
	if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
	return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

};

// 

TWEEN.Easing.Bounce.EaseIn = function( k ) {

	return 1 - TWEEN.Easing.Bounce.EaseOut( 1 - k );

};

TWEEN.Easing.Bounce.EaseOut = function( k ) {

	if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {

		return 7.5625 * k * k;

	} else if ( k < ( 2 / 2.75 ) ) {

		return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

	} else if ( k < ( 2.5 / 2.75 ) ) {

		return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

	} else {

		return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

	}

};

TWEEN.Easing.Bounce.EaseInOut = function( k ) {

	if ( k < 0.5 ) return TWEEN.Easing.Bounce.EaseIn( k * 2 ) * 0.5;
	return TWEEN.Easing.Bounce.EaseOut( k * 2 - 1 ) * 0.5 + 0.5;

};