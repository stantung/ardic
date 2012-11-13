var ScrollAnimator = function() {

	var settings = {},
		page,
		started = false,
		paused = false,
		animation = null;

	var	w = $(window),
		d = $(document),
		touch = false,					// is touch device
		touchStart = { x: 0, y: 0 },	// vars for touch
		scrollStart = 0,				// vars for scroll
		scrollTopTweened = 0,
		scrollTop = 0,
		scrollDirection = 0,
		autoScrollInterval;
	
	//--------------------------------------------------
	//Animation Controller
	//--------------------------------------------------
	function animationLoop() {
		requestAnimFrame(animationLoop);

		if (paused)
			return;
		
		if (Math.ceil(scrollTopTweened) !== Math.floor(scrollTop)) {
			//Smooth out scrolling action
			scrollTopTweened += settings.tweenSpeed * (scrollTop - scrollTopTweened);
			//Direction
			scrollDirection = scrollTop > scrollTopTweened ? 1 : -1;

			//console.log(animation[0].keyframes);
			for (var i in animation) {
				var anim = animation[i];
				
				// check if animation is in range
				if (scrollTopTweened >= anim.startAt && scrollTopTweened <= anim.endAt) {
					startAnimatable( anim );
					render( anim );
				} else {
					stopAnimatable( anim );
				}
			}

			// onAnimate callback
			if (typeof settings.onUpdate === 'function') settings.onUpdate(scrollTopTweened);
		}
	}

	function render( anim ) {
		
		//Calculate %
		var progress = (anim.startAt - scrollTopTweened) / (anim.startAt - anim.endAt);
		//Clamp progress between 0 and 100 percent (render is always called 1 lst time at the end to clean up)
		progress = Math.max(0, Math.min(1, progress));
		//Create new CSS properties map
		var properties = {};

		anim.lastProgress = progress;

//console.log(anim.keyframes);
		//Check and run keyframes within scroll range
		if (anim.keyframes) {
			for ( var i = 1; i < anim.keyframes.length; i++ ) {
				var keyframe = anim.keyframes[ i ],
					lastkeyframe = anim.keyframes[ i - 1 ],
					keyframeProgress = ( lastkeyframe.position - progress ) / ( lastkeyframe.position - keyframe.position );
				
				console.log(i);
				console.log(keyframe);

				if ( keyframeProgress >= 0 && keyframeProgress <= 1 ) {
					
					if (keyframe.onProgress && typeof keyframe.onProgress === 'function') {
						keyframe.onProgress( keyframeProgress , scrollDirection );
					}

					for ( var property in keyframe.properties ) {
						
						//Are we animating a background in more than X?
						if (property==="background-position" && keyframe.properties[property].hasOwnProperty("x")) {
							//Process the object
							var startValues = keyframe.properties[property];
							var endValues   = lastkeyframe.properties[property];
							var result = "";
							if (typeof startValues.x === "number") {
								result += getTweenedValue( endValues.x, startValues.x, keyframeProgress, 1, keyframe.ease ) + "px";
								
							} else {
								result += startValues.x
							}
							result += " ";
							if (typeof startValues.y === "number") {
								result += getTweenedValue( endValues.y, startValues.y, keyframeProgress, 1, keyframe.ease ) + "px";
							} else {
								result += startValues.y
							}
							//console.log(result);
							properties[ property ] = result;
						} else {
							//Just tween the value otherwise
							properties[ property ] = getTweenedValue( lastkeyframe.properties[property], keyframe.properties[property], keyframeProgress, 1, keyframe.ease );
						}
					}
				}
			}
		}

		// Apply all tweened css styles
		anim._elem.css( properties );

		// onProgress callback
		if (anim.onProgress && typeof anim.onProgress === 'function') {
			anim.onProgress.call(anim, progress );
		}
		
	}

	// Run before animation starts when animation is in range
	function startAnimatable( anim ) {
		// apply start properties
		if (!anim._started) {
			if (anim.onStartAnimate && typeof anim.onStartAnimate === 'function') {
				anim.onStartAnimate.call( anim , scrollDirection );
			} else {
				anim._elem.css('display', 'block');
			}
			
			anim._started = true;
		}
	}

	/* run after animation is out of range  */
	function stopAnimatable( anim ) {
			/*if (scrollDirection<0 && anim.lastProgress>0 && anim.startAt > scrollTopTweened) {

				console.log("fixed< "+anim.selector);
			} else if (scrollDirection>0 && anim.lastProgress<1 && anim.endAt < scrollTopTweened) {

				console.log("fixed> "+anim.selector);
			}*/

		// Apply end properties after items move out of range if they were running
		if ( (anim._started && anim.endAt < scrollTopTweened || anim._started && anim.startAt > scrollTopTweened ) 
			|| (scrollDirection<0 && anim.lastProgress>0 && anim.startAt > scrollTopTweened)
			|| (scrollDirection>0 && anim.lastProgress<1 && anim.endAt < scrollTopTweened) 
			) {

			render( anim );
			
			if (anim.onEndAnimate && typeof anim.onEndAnimate === 'function') {
				anim.onEndAnimate.call( anim , scrollDirection );
			} else {
				anim._elem.css('display', 'none');
			}
			anim._started = false;
		} 
		
	}

	/* 
	sets up all the start and end parameters for each animation 
	this will run when our page is loaded and on resizing
	*/
	function setAnimatable() {
		for (var i in animation) {
			var anim = animation[i];

			anim.lastProgress = 0;

			// grab dom element
			if (anim._elem == undefined) {
				anim._elem = $(anim.selector);
			}

			if (typeof anim.onInit == 'function') anim.onInit.call( anim );

			// iterate through keyframes
			for (var k in anim.keyframes) {
				var keyframe = anim.keyframes[k];

				/*	// default starting properties
					startProperties = { 
						display: 'none',
						position: 'absolute'
					};
				
				// apply starting properties
				if (keyframe.position == 0) {
					anim._elem.css( $.extend( startProperties, keyframe.properties ) );
				};*/
				
				// setup keyframe 0
				if (keyframe.position == 0) {
					var nKeyframe = anim.keyframes[Number(k)+1];	// next keyframe
					for (var property in nKeyframe.properties) {
						if (keyframe.properties[ property ] == undefined) {
							// grab current offset and load into properties for keyframe 0
							if (/left|top/.test(property)) {
								keyframe.properties[ property ] = anim._elem.position()[ property ];
							}

							// todo: width & height
						}
					}
				}
				
				// fill in properties from current element
				// find missing properties from last occurance of property
				var bIndex = Number(k); // start 1 back from current

				while (bIndex > 0) {
					var bKeyframe = anim.keyframes[ bIndex ];

					for (var property in bKeyframe.properties) {
						if ( keyframe.properties[ property ] == undefined) {
							keyframe.properties[ property ] = bKeyframe.properties[ property ];
						}
					}

					bIndex--;
				};

				// onInit callback
				if (typeof keyframe.onInit == 'function') keyframe.onInit( anim );

			}
		
		}
		
	}
	
	function resize() {
			
		var container = settings.container;

		page = {
			wWidth:  settings.container.width(),
			wHeight: settings.container.height(),
			wCenter: { left: settings.container.width()/2, top: settings.container.height()/2 }
		};

		// onResize callback
		if (settings.onResize && typeof settings.onResize === 'function') 
			settings.onResize(page);
		
		resetAnimatable();
		setAnimatable();
		start();
	}
	
	// resets animations
	function resetAnimatable() {
		for (var i in animation) {
			var anim = animation[i];
		
			if (anim._started) {
				delete anim._elem;
				delete anim._started;
			}
		}
	}


	// --------------------------------------------------
	// EVENT HANDLERS
	// --------------------------------------------------

	// window resize 
	function resizeHandler(e) {
		resize();
	}
	
	// touch
	function touchStartHandler(e) {
		//e.preventDefault();
		touchStart.x = e.touches[0].pageX;

		// Store the position of finger on swipe begin:
		touchStart.y = e.touches[0].pageY;

		// Store scroll val on swipe begin:
		scrollStart = scrollTop;
	};

	function touchEndHandler(e) {
		
	}

	function touchMoveHandler(e) {

		e.preventDefault();
		if (paused)
			return;
		var offset = {};
		offset.x = touchStart.x - e.touches[0].pageX;

		// Get distance finger has moved since swipe begin:
		offset.y = touchStart.y - e.touches[0].pageY;	

		// Add finger move dist to original scroll value
		scrollTop = Math.max(0, scrollStart + offset.y);
		checkScrollExtents();
	}

	// scrollwheel
	function wheelHandler(e, delta, deltaX, deltaY) {
		if (paused)
			return;
		scrollTop -= delta * settings.scrollSpeed;
		if ( scrollTop < 0) scrollTop = 0;
		checkScrollExtents();
	};

	function checkScrollExtents() {
		if (scrollTop < 0) 
			scrollTop = 0;
		else if (scrollTop > settings.maxScroll) 
			scrollTop = settings.maxScroll;
	}

	//--------------------------------------------------
	// Helpers
	//--------------------------------------------------
	
	// get tweened values
	function getTweenedValue(start, end, currentTime, totalTime, tweener) {
	    var delta = end - start;
	    var percentComplete = currentTime/totalTime;
	    //if (!tweener) tweener = TWEEN.Easing.Linear.EaseNone;
	    tweener = TWEEN.Easing.Linear.EaseNone;
	    //console.log(tweener);
	    return tweener(percentComplete) * delta + start
	}
	
	// dected if touch events
	function isTouch() {
		return 'ontouchstart' in window;
	}

	// --------------------------------------------------
	// PUBLIC
	// --------------------------------------------------
	function init( opts ) {
		var defaults = {
				maxScroll: 1000,
				tickSpeed: 30,
				scrollSpeed: 20,
				useRAF: true,
				tweenSpeed: .3
			};

		settings = $.extend( defaults, opts );
		
		animation = settings.animation;
		console.log(animation[0].keyframes[1]);
		touch = isTouch();
		
		if (touch) {
			var container = settings.container[0];
			container.addEventListener('touchstart', touchStartHandler, true);
			container.addEventListener('touchmove', touchMoveHandler, true);
			container.addEventListener('touchend', touchEndHandler, true);
		}

		d.on('mousewheel', wheelHandler);
		w.on('resize', resizeHandler);

		// animation loop
		window.requestAnimFrame = (function(){
			if (settings.useRAF) {
				return  
				window.requestAnimationFrame       || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
				function( callback ){
					window.setTimeout(callback, settings.tickSpeed);
				};
			} else {
				return function( callback ){
					window.setTimeout( callback, settings.tickSpeed);
				}
			};
		})();

		resize();
		
		return this;
	};
	
	// start
	function start() {
		if (!started && settings.startAt) scrollTopTweened = scrollTop = settings.startAt;
		
		scrollTop++;

		if (!started) {
			animationLoop();
			started=true;
		};

		if (settings.onStart && typeof settings.onStart === 'function') {
			settings.onStart();
		}
	};

	function getPageInfo() {
		return page;
	};

	function getScrollTop() {
		return scrollTopTweened;
	};

	function getMaxScroll() {
		return settings.maxScroll;
	};

	function scrollTo( scroll ) {
		if (paused)
			return;
		scrollTop = scroll;
	};

	function autoScrollStart() {
		if (autoScrollInterval)
			return;
		autoScrollInterval = setInterval( aScroll, 100  );
	}

	function autoScrollStop() {
		clearInterval( autoScrollInterval );
	}

	function aScroll() {
		scrollTop+= 5;
		if (scrollTop > settings.maxScroll) scrollTop = scrollTopTweened = 0;
	}

	function stopScroll() {
		scrollTopTweened = scrollTop;
	}

	function pauseScroll() {
		paused = true;
	}

	function resumeScroll() {
		paused = false;
	}

	function toggleDebug() {
		if (settings.debugId == false || settings.debugId == undefined) {
			console.log('debug on');
			settings.debugId=true;
			$('#status2').show();
			$('#status').show();
		} else {
			console.log('debug off');
			settings.debugId=false;
			$('#status2').hide();
			$('#status').hide();
		}
		
		for (var i in animation) {
			var anim = animation[i];

			if (settings.debugId == true) {
				anim._elem.css('border', '1px dashed red');
			} else {
				anim._elem.css('border', '');
				$('body').find('.debugid').remove();
			}
		}
	};

	function isDebug() {
		return settings.debug;
	};

	return {
		init: init,
		start: start,
		pause: pauseScroll,
		resume: resumeScroll,
		getPageInfo: getPageInfo,
		getScrollTop: getScrollTop,
		getMaxScroll: getMaxScroll,
		autoScrollStart: autoScrollStart,
		autoScrollStop: autoScrollStop,
		stopScroll: stopScroll,
		scrollTo: scrollTo,
		isDebug: isDebug,
		toggleDebug: toggleDebug,
		resize:resize
	}
};
