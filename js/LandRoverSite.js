/*-----------------------------------------------------------------------

http://victoriabeckham.landrover.com/ 
Range Rover Evoque Special Edition With Victoria Beckham by
 _     _                             _(_)          
| |__ | | __ _ ___| |_ _ __ __ _  __| |_ _   _ ___ 
| '_ \| |/ _` / __| __| '__/ _` |/ _` | | | | / __|   amsterdam
| |_) | | (_| \__ \ |_| | | (_| | (_| | | |_| \__ \   london
|_.__/|_|\__,_|___/\__|_|  \__,_|\__,_|_|\__,_|___/   2012

Tech Lead & Dev : Richard Jewson
PM				: Adeola Adedeji
Creative		: Gareth Leeding
Dev				: Paul Cheteles
Dev				: George Cheteles
QA				: Monica Pop-Timar
Creative		: Alex Champion

Respect AJ2012 team!

-----------------------------------------------------------------------*/

var LandroverSite = (function() {
	var settings = {},
		defaults = {
			startAt: 0,					// start experience at
			sectionCheckInterval: 1000,	// check section interval
			clampWidth: 1600,
			tracking: false
		},
		scrollAnimate,
		currentSection = -1,
		checkSectionLock = 0,
		updateCount = 0,
		loadProgress;
	
	//Animation viewport metrics
	var wHeight, wWidth, wCenter, outroComp, ratio;
	//Scrollbar related stuff
	var $scrollBar, $scrollThumb, isScrolling, scrollBarHeight, scrollThumbHeight, thumbDelta, scrollThumbPosition, scrollPercent;
	//Tooltip stuff
	var tooltipJustOpened = true;
	//Overlay
	var $overlay;
	var player;
	var lastActivity = (new Date()).getTime();
	var pulseReminders = 3;
	var pulseScrollTeaserRunning = false;

	//---------------------------------------------
	// Animation Position Helpers
	//---------------------------------------------

	var animationFunctions = {
		
		absPosition: function(opts) {
			var defaults = {startLeft: 0,
							startTop: 0,
							endLeft: 0,
							endTop: 0},
			settings = $.extend(defaults, opts);
			this.startProperties['left'] = settings.startLeft;
			this.startProperties['top'] = settings.startTop;
			this.endProperties['left'] = settings.endLeft;
			this.endProperties['top'] = settings.endTop;
			this.startProperties['display'] = 'block';
			this.endProperties['display'] = 'none';
		},
			
		bottomLeftOutside: function( anim, opts ) {
			var defaults = {offset:0}, settings = $.extend(defaults, opts);
			var portrait = false, //wHeight > wWidth ? true : false,
				elemHalfWidth = anim._elem.width()/2,
				elemHalfHeight = anim._elem.height()/2,
				adj = portrait ? wWidth/2 + elemHalfWidth : adj = wHeight/2 + elemHalfHeight,
				tan = Math.sqrt( Math.pow( adj, 2) + Math.pow( adj, 2) );
			
			this.properties['top'] = wCenter.top + adj - elemHalfHeight + (portrait ? settings.offset : 0);
			this.properties['left'] = wCenter.left - adj - elemHalfWidth + (portrait ? 0 : settings.offset);
		},

		topRightOutside: function( anim, opts ) {
			var defaults = {offset:0}, settings = $.extend(defaults, opts);
			var portrait = false, //wHeight > wWidth ? true : false,
				elemHalfWidth = anim._elem.width()/2,
				elemHalfHeight = anim._elem.height()/2,
				adj = portrait ? wWidth/2 + elemHalfWidth : adj = wHeight/2 + elemHalfHeight,
				tan = Math.sqrt( Math.pow( adj, 2) + Math.pow( adj, 2) );

			this.properties['top'] = wCenter.top - adj - elemHalfHeight + (portrait ? settings.offset : 0);
			this.properties['left'] = wCenter.left + adj - elemHalfWidth + (portrait ? 0 : settings.offset);
		},

		leftOutside: function( anim, opts ) {
			var defaults = {offset:0}, settings = $.extend(defaults, opts);
			this.properties['left'] = -anim._elem.width() + settings.offset;
		},

		leftOutsideClampWidth: function( anim, opts ) {
			this.properties['left'] = -anim._elem.width() - (settings.clampWidth - wWidth)/2;
		},

		rightOutside: function( anim, opts ) {
			var defaults = {offset:0}, settings = $.extend(defaults, opts);
			this.properties['left'] = wWidth + settings.offset;
		},

		rightOutsideClampWidth: function( anim, opts ) {
			this.properties['left'] = wWidth + (settings.clampWidth - wWidth)/2;
		},

		centerV: function( anim, opts ) {
			var defaults = {offset:0}, settings = $.extend(defaults, opts);
			var elemHalfHeight = anim._elem.height()/2;
			this.properties['top'] = wCenter.top - elemHalfHeight + settings.offset;
		},

		centerH: function( anim, opts ) {
			var defaults = {offset:0}, settings = $.extend(defaults, opts);			
			var elemHalfWidth = anim._elem.width()/2;
			this.properties['left'] = wCenter.left - elemHalfWidth + settings.offset;	
		},

		bottomOutside: function( anim, opts ) {
			var defaults = {offset:0}, settings = $.extend(defaults, opts);
			this.properties['top'] = wHeight + settings.offset;
		},

		topOutside: function( anim, opts) {
			var defaults = {offset:0}, settings = $.extend(defaults, opts);
			this.properties['top'] = -anim._elem.height() + settings.offset;
		},

		rightInside: function( anim, opts ) {
			var defaults = {offset:0}, settings = $.extend(defaults, opts);
			this.properties['left'] =  -anim._elem.width() + (wWidth) + settings.offset;
		},

		backgroundA: function( anim, opts ) {
			var defaults = {offset:0,bgsize:0}, settings = $.extend(defaults, opts);
			this.properties['background-position'] = anim._elem.width() + settings.offset - (1600-wWidth)/2;
			//trace("A="+(anim._elem.width() - (1600-wWidth)/2))
		},

		backgroundB: function( anim, opts ) {
			var defaults = {offset:0,bgsize:0}, settings = $.extend(defaults, opts);
			this.properties['background-position'] = -opts.bgsize + settings.offset + (1600-wWidth)/2;
			//trace("B="+(-opts.bgsize + (1600-wWidth)/2))
		}

	}


	//---------------------------------------------
	// Animation Data
	//---------------------------------------------
	
	var t = 0;

	var totalHeightPx = 8000;
	var outroHeightPx = 4000;

	var detailStart = 2000;
	var outroStart = 5180;
	var outroLength = 0;
	var eventsDelta = 0;
	var maxScroll = 0; 

	var sectionIndex = [
		{id:"#intro1",name:"intro1",tag:"#intro1",position:0,correct:false},
		{id:"#intro2",name:"intro2",tag:"#intro2",position:500,correct:false},
		{id:"#intro3",name:"intro3",tag:"#intro3",position:1000,correct:false},
		{id:"#intro4",name:"intro4",tag:"#intro4",position:1500,correct:false},
		{id:"#horizontalSection",name:"horizontal",tag:"#horizontal",position:detailStart,correct:false},
		{id:"#outro1",name:"outro1",tag:"#outro1",position:outroStart+670,correct:true},
		{id:"#outro2",name:"outro2",tag:"#outro2",position:outroStart+1240,correct:true},
		{id:"#outro3",name:"outro3",tag:"#outro3",position:outroStart+1840,correct:true}
	];

	if (window.eventSectionLive) {
		sectionIndex.push({id:"#outro4",name:"outro4",tag:"#outro4",position:outroStart+2499,correct:true});
		sectionIndex.push({id:"#outro5",name:"outro5",tag:"#outro5",position:outroStart+3100,correct:true});
		totalHeightPx+=1000;
		outroHeightPx+=1000;
		outroLength = 3100;
		eventsDelta = 600;
	} else {
		sectionIndex.push({id:"#outro5",name:"outro5",tag:"#outro5",position:outroStart+2499,correct:true});
		outroLength = 2500;
		$("#outro4").css("display","none");
		eventsDelta = 0;
	}

	maxScroll = outroStart+outroLength;

	var i2delta = 50;

	var animation = [


	         		{
	         			selector: '#verticalScrollArea',
	         			startAt: 0,
	         			endAt: detailStart,
	         			onEndAnimate:function( anim ) {
	         			},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						top: 0
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
									this.properties['top'] = -4030 +  Math.max( ((wHeight-1000)/2) , 0);

     							},
	         					properties: {
	         						//top: -4030
	         					}
	         				}
	         			]
	         		},
	         		//---------------------------------------------
	         		//INTRO 1
	         		//---------------------------------------------
	         		{
	         			selector: '#intro1',
	         			startAt: 0,
	         			endAt: 400,
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					onInit: function( anim ) {
									var yPos = Math.min(-200,-(1000-wHeight));
									this.properties['background-position'] = {x:"50%",y:yPos};

     							},
	         					properties: {
	         						// "background-position" : {x:"50%",y:0}
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					// ease: TWEEN.Easing.Quadratic.EaseInOut,
	         					properties: {
	         						"background-position" : {x:"50%",y:100}
	         					}
	         				}
	         			]
	         		},
	         		{
	         			selector: '#intro1 > .content',
	         			startAt: 0,
	         			endAt: 600,
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					onInit: function( anim ) {
									var yPos = 98;//Math.min(-200,-(1000-wHeight));
									if (wHeight<730) {
										yPos -= (730-wHeight)*0.9;
										yPos = yPos<0 ? 0 : yPos;
										//console.log(yPos);
									}
									this.properties['margin-top'] = yPos;

     							},
	         					properties: {
	         						//"margin-top": 64
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					properties: {
	         						"margin-top": 600
	         					}
	         				}
	         			]
	         		},
	         		{
	         			selector: '#intro1 > .content > p',
	         			startAt: 0,
	         			endAt: 600,
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"margin-top": 20
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					properties: {
	         						"margin-top": 100
	         					}
	         				}
	         			]
	         		},
	         		//---------------------------------------------
	         		//INTRO 2
	         		//---------------------------------------------     		
	         		// {
	         		// 	selector: '#intro2',
	         		// 	startAt: 0,
	         		// 	endAt: 1000,
	         		// 	onEndAnimate:function( anim ) {},
	         		// 	keyframes: [
	         		// 		{ 
	         		// 			position: 0,
	         		// 			properties: {
	         		// 				"background-position" : {x:"50%",y:-600}
	         		// 			}
	         					
	         		// 		},
	         		// 		{ 
	         		// 			position: 0.5,
	         		// 			properties: {
	         		// 				"background-position" : {x:"50%",y:100}
	         		// 			}
	         					
	         		// 		},
	         		// 		{
	         		// 			position: 1,
	         		// 			ease: TWEEN.Easing.Sinusoidal.EaseOut,
	         		// 			properties: {
	         		// 				"background-position" : {x:"50%",y:400}
	         		// 			}
	         		// 		}
	         		// 	]
	         		// },

	         		{
	         			selector: '#intro2 > .content > .bg1',
	         			startAt: 250,
	         			endAt: 800,
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"margin-top": -200 + i2delta
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseInOut,
	         					properties: {
	         						"margin-top": 250 + i2delta
	         					}
	         				}
	         			]
	         		},
	         		{
	         			selector: '#intro2 > .content > .bg2',
	         			startAt: 250,
	         			endAt: 800,
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"margin-top": -250 + i2delta
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseInOut,
	         					properties: {
	         						"margin-top": 350 + i2delta
	         					}
	         				}
	         			]
	         		},
	         		{
	         			selector: '#intro2 > .content > .bg3',
	         			startAt: 250,
	         			endAt: 800,
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"margin-top": -350 + i2delta
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseInOut,
	         					properties: {
	         						"margin-top": 400 + i2delta
	         					}
	         				}
	         			]
	         		},
	         		{
	         			selector: '#intro2 > .content > .bg4',
	         			startAt: 250,
	         			endAt: 800,
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"margin-top": -300 + i2delta
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseInOut,
	         					properties: {
	         						"margin-top": 350 + i2delta
	         					}
	         				}
	         			]
	         		},
	         		{
	         			selector: '#intro2 > .content > .copy',
	         			startAt: 380,
	         			endAt: 800,
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"top": -350
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseOut,
	         					properties: {
	         						"top": 400
	         					}
	         				}
	         			]
	         		},
	         		// {
	         		// 	selector: '#intro2 > .content > .copy > p',
	         		// 	startAt: 650,
	         		// 	endAt: 800,
	         		// 	onEndAnimate:function( anim ) {},
	         		// 	keyframes: [
	         		// 		{ 
	         		// 			position: 0,
	         		// 			properties: {
	         		// 				"margin-bottom": 0
	         		// 			}
	         					
	         		// 		},
	         		// 		{
	         		// 			position: 1,
	         		// 			ease: TWEEN.Easing.Linear.EaseNone,
	         		// 			properties: {
	         		// 				"margin-bottom": 60
	         		// 			}
	         		// 		}
	         		// 	]
	         		// },
	         		//---------------------------------------------
	         		//INTRO 3
	         		//Change the timing to raise/lower the static car position
	         		//---------------------------------------------
	         		{
	         			selector: '#intro3',
	         			startAt: 700,
	         			endAt: 1525,
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"background-position" : {x:"50%",y:-400}
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseInOut,
	         					properties: {
	         						"background-position" : {x:"50%",y:500}
	         					}
	         				}
	         			]
	         		},
	         		{
	         			selector: '#intro3 > .content',
	         			startAt: 840,
	         			endAt: 1340,
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"margin-top": -400
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseOut,
	         					properties: {
	         						"margin-top": 400
	         					}
	         				}
	         			]
	         		},
					{
	         			selector: '#intro3 > .content > div.quote',
	         			startAt: 1000,
	         			endAt: 1400,
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"margin-top": 0
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseOut,
	         					properties: {
	         						"margin-top": 60
	         					}
	         				}
	         			]
	         		},	     
	         		//---------------------------------------------
	         		//INTRO 4
	         		//---------------------------------------------
        			{
	         			selector: '#intro4',
	         			startAt: 1000,
	         			endAt: 2000,
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"background-position" : {x:"50%",y:-500}
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					properties: {
	         						"background-position" : {x:"50%",y:400}
	         					}
	         				}
	         			]
	         		},
	         		{
	         			selector: '#intro4 > .content',
	         			startAt: 1250,
	         			endAt: 1750,
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"margin-top": -400
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseOut,
	         					properties: {
	         						"margin-top": 400
	         					}
	         				}
	         			]
	         		},
	         		{
	         			selector: '#intro4 > .content > div.quote',
	         			startAt: 1500,
	         			endAt: 2000,
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"margin-top": 0,
	         						"margin-bottom": 0
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					properties: {
	         						"margin-top": 60,
	         						"margin-bottom": 60
	         					}
	         				}
	         			]
	         		},
	         		//---------------------------------------------
	         		//DETAIL 1
	         		//Started at 4000px
	         		//---------------------------------------------
					{
	         			selector: '#horizontalSection > .content > p',
	         			startAt: detailStart-300,
	         			endAt: detailStart,
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"margin-top": -400,
	         						"margin-bottom": 200
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Quadratic.EaseOut,
	         					onInit: function( anim ) {

	         						anim._elem.height()/2
	         						var yPos = Math.max(40,240 - (anim._elem.height()/2) - Math.max(0,1000-wHeight)/2);
	         						
									this.properties['margin-top'] = yPos;
     							},
	         					properties: {
	         						//"margin-top": 60,
	         						"margin-bottom": 0
	         					}
	         				}
	         			]
	         		},
					{
	         			selector: '#detail1',
	         			startAt: detailStart,
	         			endAt: detailStart+500,
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								animationFunctions.rightOutside.call( this, anim, {});
									//this.properties['background-position'] = -1600 + (1600-wWidth)/2;
									this.properties['background-position'] = -1600 + (1600-wWidth)/2;
     							},
	         					properties: {
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								animationFunctions.leftOutside.call( this, anim, {});
     								this.properties['background-position'] = 320 - (1600-wWidth)/2;
     							},	         					
	         					properties: {
	         					}
	         				}
	         			]
	         		},
	         		//---------------------------------------------
	         		//DETAIL 2
	         		//---------------------------------------------	         		
					{
	         			selector: '#detail2',
	         			startAt: detailStart+500,
	         			endAt: detailStart+1050,
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.rightOutside.call( this, anim, {});
     								animationFunctions.rightOutsideClampWidth.call( this, anim, {});
     								//console.log(">"+this.properties['left']);
     							},
	         					properties: {
	         						"background-position":-1100
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								animationFunctions.leftOutsideClampWidth.call( this, anim, {});
     								//console.log("<"+this.properties['left']);
     							},	         					
	         					properties: {
	         						"background-position":400
	         					}
	         				}
	         			]
	         		},
	         		//---------------------------------------------
	         		//DETAIL 3
	         		//---------------------------------------------	         	
					{
	         			selector: '#detail3',
	         			startAt: detailStart+600,
	         			endAt: detailStart+1200,
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.rightOutside.call( this, anim, {});
     								animationFunctions.rightOutsideClampWidth.call( this, anim, {});
     							},
	         					properties: {
	         						"background-position":0
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.leftOutside.call( this, anim, {});
     								animationFunctions.leftOutsideClampWidth.call( this, anim, {});
     							},	         					
	         					properties: {
	         						"background-position":0
	         					}
	         				}
	         			]
	         		},
	         		//---------------------------------------------
	         		//DETAIL 4
	         		//---------------------------------------------	         		
					{
	         			selector: '#detail4',
	         			startAt: detailStart+760,
	         			endAt: detailStart+1470,
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.rightOutside.call( this, anim, {});
    								animationFunctions.rightOutsideClampWidth.call( this, anim, {});
    								//animationFunctions.backgroundB.call(this,anim,{bgsize:1600,offset:0});

     							},
	         					properties: {
	         						"background-position":-1500
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.leftOutside.call( this, anim, {});
     								animationFunctions.leftOutsideClampWidth.call( this, anim, {});
     								//animationFunctions.backgroundA.call(this,anim,{bgsize:1600,offset:0});
     							},	         					
	         					properties: {
	         						"background-position":935
	         					}
	         				}
	         			]
	         		},	        
					{
	         			selector: '#detail5',
	         			startAt: detailStart+1030,
	         			endAt: detailStart+1575,
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.rightOutside.call( this, anim, {});
     								animationFunctions.rightOutsideClampWidth.call( this, anim, {});
     								//animationFunctions.backgroundB.call(this,anim,{bgsize:1062,offset:0});
     							},
	         					properties: {
	         						//"background-position":-830
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					//ease: TWEEN.Easing.Quadratic.EaseInOut,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.leftOutside.call( this, anim, {});
     								animationFunctions.leftOutsideClampWidth.call( this, anim, {});
     								//animationFunctions.backgroundA.call(this,anim,{bgsize:1062,offset:0});
     							},	         					
	         					properties: {
	         						//"background-position":290
	         					}
	         				}
	         			]
	         		},
					{
	         			selector: '#detail5',
	         			startAt: detailStart+1030,
	         			endAt: detailStart+1400,
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     							},
	         					properties: {
	         						"background-position":-800
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseInOut,
	         					//ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     							},	         					
	         					properties: {
	         						"background-position":0
	         					}
	         				}
	         			]
	         		},
					{
	         			selector: '#detail6',
	         			startAt: detailStart+1160,
	         			endAt: detailStart+1960,
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.rightOutside.call( this, anim, {});
     								animationFunctions.rightOutsideClampWidth.call( this, anim, {});
     								//this.properties['background-position'] = -1400 + (settings.clampWidth-wWidth)/2;
     								this.properties['background-position'] = {x:-1400 + (settings.clampWidth-wWidth)/2,y:"top"};
     							},
	         					properties: {
	         						//"background-position":-1500
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					//ease: TWEEN.Easing.Sinusoidal.EaseInOut,
	         					onInit: function( anim ) {
     								//animationFunctions.leftOutside.call( this, anim, {});
     								animationFunctions.leftOutsideClampWidth.call( this, anim, {});
     								//this.properties['background-position'] = 1400 - (settings.clampWidth-wWidth)/2;
     								this.properties['background-position'] = {x:1400 - (settings.clampWidth-wWidth)/2,y:"top"};
     							},	         					
	         					properties: {
	         						//"background-position":1500
	         					}
	         				}
	         			]
	         		},	  
					{
	         			selector: '#detail6 > .content',
	         			startAt: detailStart+1160,
	         			endAt: detailStart+1960,
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.rightOutside.call( this, anim, {});
     								// animationFunctions.rightOutsideClampWidth.call( this, anim, {});
     								//this.properties['left'] = -1600 + (1600-wWidth)/2;
     							},
	         					properties: {
	         						"left":-1600
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					//ease: TWEEN.Easing.Sinusoidal.EaseInOut,
	         					onInit: function( anim ) {
     								//animationFunctions.leftOutside.call( this, anim, {});
     								// animationFunctions.leftOutsideClampWidth.call( this, anim, {});
     								//this.properties['left'] = -1600 + (1600-wWidth)/2;
     							},	         					
	         					properties: {
	         						"left":1600
	         					}
	         				}
	         			]
	         		},
					{
	         			selector: 'html.opacity #detail6 > .content > p',
	         			startAt: detailStart+1400,
	         			endAt: detailStart+1500,
	         			onEndAnimate:function( direction ) {
	         			},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.rightOutside.call( this, anim, {});
     								// animationFunctions.rightOutsideClampWidth.call( this, anim, {});
     							},
	         					properties: {
	         						"opacity":0
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					//ease: TWEEN.Easing.Sinusoidal.EaseInOut,
	         					onInit: function( anim ) {
     								//animationFunctions.leftOutside.call( this, anim, {});
     								// animationFunctions.leftOutsideClampWidth.call( this, anim, {});
     							},	         					
	         					properties: {
	         						"opacity":1
	         					}
	         				}
	         			]
	         		},
	         		{
	         			selector: 'html.opacity #detail6 > .content > p',
	         			startAt: detailStart+1600,
	         			endAt: detailStart+1700,
	         			onEndAnimate:function( direction ) {
	         			},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.rightOutside.call( this, anim, {});
     								// animationFunctions.rightOutsideClampWidth.call( this, anim, {});
     							},
	         					properties: {
	         						"opacity":1
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					//ease: TWEEN.Easing.Sinusoidal.EaseInOut,
	         					onInit: function( anim ) {
     								//animationFunctions.leftOutside.call( this, anim, {});
     								// animationFunctions.leftOutsideClampWidth.call( this, anim, {});
     							},	         					
	         					properties: {
	         						"opacity":0
	         					}
	         				}
	         			]
	         		},	      	     
					{
	         			selector: '#detail7',
	         			startAt: detailStart+1555,
	         			endAt: detailStart+2100,
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.rightOutside.call( this, anim, {});
     								animationFunctions.rightOutsideClampWidth.call( this, anim, {});
     								//animationFunctions.backgroundB.call(this,anim,{bgsize:1210});
     							},
	         					properties: {
	         						"background-position":-1000
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.leftOutside.call( this, anim, {});
     								animationFunctions.leftOutsideClampWidth.call( this, anim, {});
     								//animationFunctions.backgroundA.call(this,anim,{bgsize:1210});
     							},	         					
	         					properties: {
	         						"background-position":400
	         					}
	         				}
	         			]
	         		},	         	
					{
	         			selector: '#detail8',
	         			startAt: detailStart+1700,
	         			endAt: detailStart+2325,
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.rightOutside.call( this, anim, {});
     								animationFunctions.rightOutsideClampWidth.call( this, anim, {});
     								//animationFunctions.backgroundB.call(this,anim,{bgsize:1373,offset:0});
     							},
	         					properties: {
	         						"background-position":-900
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.leftOutside.call( this, anim, {});
     								animationFunctions.leftOutsideClampWidth.call( this, anim, {});
     								//animationFunctions.backgroundA.call(this,anim,{bgsize:1373,offset:0});
     							},	         					
	         					properties: {
	         						"background-position":775
	         					}
	         				}
	         			]
	         		},	      
					{
	         			selector: '#detail9',
	         			startAt: detailStart+1937,
	         			endAt: detailStart+2467,
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.rightOutside.call( this, anim, {});
     								animationFunctions.rightOutsideClampWidth.call( this, anim, {});
     							},
	         					properties: {
	         						"background-position":0
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.leftOutside.call( this, anim, {});
     								animationFunctions.leftOutsideClampWidth.call( this, anim, {});
     							},	         					
	         					properties: {
	         						"background-position":0
	         					}
	         				}
	         			]
	         		},	         
					{
	         			selector: '#detail10',
	         			startAt: detailStart+2075,
	         			endAt: detailStart+2700,
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.rightOutside.call( this, anim, {});
     								animationFunctions.rightOutsideClampWidth.call( this, anim, {});
     								//animationFunctions.backgroundB.call(this,anim,{bgsize:1336});
     							},
	         					properties: {
	         						"background-position":-1100
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.leftOutside.call( this, anim, {});
     								animationFunctions.leftOutsideClampWidth.call( this, anim, {});
     								//animationFunctions.backgroundA.call(this,anim,{bgsize:1336});
     							},	         					
	         					properties: {
	         						"background-position":825
	         					}
	         				}
	         			]
	         		},
	         		{
	         			selector: '#detail11',
	         			startAt: detailStart+2300,
	         			endAt: detailStart+3062,
	         			onEndAnimate:function( direction ) {
	         				// if (direction<0) {
	         				// 	this.properties['left'] = 'none';
	         				// }
	         			},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.rightOutside.call( this, anim, {});
     								animationFunctions.rightOutsideClampWidth.call( this, anim, {});
     							},
	         					properties: {
	         						// "background-position":0
	         					}
	         					
	         				},
	         				{
	         					position: 0.5,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								//animationFunctions.leftOutside.call( this, anim, {});
     								this.properties['left'] = -(1600-wWidth)/2;
     							},	         					
	         					properties: {
	         						// "background-position":0
	         					}
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     							},	         					
	         					properties: {
	         					}
	         				}
	         			]
	         		},	         
					{
	         			selector: '#detail12',
	         			startAt: detailStart+2680,
	         			endAt: detailStart+3180,
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								animationFunctions.rightOutside.call( this, anim, {});
									//this.properties['background-position'] = -1600 + (1600-wWidth)/2;
									this.properties['background-position'] = -1600 + (1600-wWidth)/2;
     							},
	         					properties: {
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
     								animationFunctions.leftOutside.call( this, anim, {});
     								this.properties['background-position'] = 320 - (1600-wWidth)/2;
     							},	         					
	         					properties: {
	         					}
	         				}
	         			]
	         		},
					{
	         			selector: '#detail11 > .content > p',
	         			startAt: outroStart,
	         			endAt: outroStart+200,
	         			onEndAnimate:function( anim ) {
	         			},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					properties: {
	         						opacity:1
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,         					
	         					properties: {
	         						opacity:0
	         					}
	         				}
	         			]
	         		},	    	  	         			    	         						   			    				 		
	         		{
	         			selector: '#verticalScrollArea',
	         			//startAt: outroStart,
	         			//endAt: outroStart+2500,
	         			onInit: function() {
							this.startAt = outroStart;// - outroComp;
							this.endAt = maxScroll;// - outroComp;
     					},
	         			onEndAnimate:function( anim ) {
	         			},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					onInit: function( anim ) {
									this.properties['top'] = -4030 +  Math.max( ((wHeight-1000)/2) , 0);

     							},
	         					properties: {
	         						//top: -4030, left: 0
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Linear.EaseNone,
	         					onInit: function( anim ) {
									//this.properties['top'] = -4030 +  Math.max( ((wHeight-1000)/2) , 0);
									this.properties.top = -totalHeightPx+Math.max(0,wHeight-1000);
     							},
	         					properties: {
	         						//top: -8680
	         					}
	         				}
	         			]
	         		},
	         		//---------------------------------------------
	         		//OUTRO 1 5180
	         		//---------------------------------------------	        
	         		{
	         			selector: '#outro1',
	         			//startAt: outroStart+000,
	         			//endAt: outroStart+1300,
	         			onInit: function() {
							this.startAt = outroStart+000 - ratio;
							this.endAt = outroStart+1300 - ratio;
     					},
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"background-position" : {x:"50%",y:-500}
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseOut,
	         					properties: {
	         						"background-position" : {x:"50%",y:200}
	         					}
	         				}
	         			]
	         		},
	         		{
	         			selector: '#outro1 > .content',
	         			//startAt: outroStart+420,
	         			//endAt: outroStart+1100,
	         			onInit: function() {
							this.startAt = outroStart+420 - ratio;
							this.endAt = outroStart+1100 - ratio;
     					},
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"margin-top": 0
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseOut,
	         					properties: {
	         						"margin-top": 600
	         					}
	         				}
	         			]
	         		},
	         		//---------------------------------------------
	         		//OUTRO 2
	         		//---------------------------------------------		         		     		
	         		// {
	         		// 	selector: '#outro2',
	         		// 	startAt: outroStart+000,
	         		// 	endAt: outroStart+1000,
	         		// 	onEndAnimate:function( anim ) {},
	         		// 	keyframes: [
	         		// 		{ 
	         		// 			position: 0,
	         		// 			properties: {
	         		// 				"background-position" : -200//{x:"50%",y:0}
	         		// 			}
	         					
	         		// 		},
	         		// 		{
	         		// 			position: 1,
	         		// 			ease: TWEEN.Easing.Linear.EaseNone,
	         		// 			properties: {
	         		// 				"background-position" : 0//{x:"50%",y:0}
	         		// 			}
	         		// 		}
	         		// 	]
	         		// },
	         		{
	         			selector: '#outro2 > .content1',
	         			startAt: outroStart+500,
	         			endAt: outroStart+1000,
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"background-position" : -200,
	         						"margin-top": 180
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseOut,
	         					properties: {
	         						"background-position" : 0,
	         						"margin-top": 180
	         					}
	         				}
	         			]
	         		},	         	
	         		{
	         			selector: '#outro2 > .content2',
	         			startAt: outroStart+500,
	         			endAt: outroStart+1000,
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"margin-top": 650
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseOut,
	         					properties: {
	         						"margin-top": 650
	         					}
	         				}
	         			]
	         		},	         	         			
	         		//---------------------------------------------
	         		//OUTRO 3  (5180) +400
	         		//---------------------------------------------		  	
	         		/*{
	         			selector: '#outro3',
	         			//startAt: outroStart+1200,
	         			//endAt: outroStart+2100,
	         			onInit: function() {
							this.startAt = outroStart+1200 - outroComp;
							this.endAt = outroStart+2100 - outroComp;
     					},
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"background-position" : {x:"50%",y:-500}
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseInOut,
	         					properties: {
	         						"background-position" : {x:"50%",y:400}
	         					}
	         				}
	         			]
	         		},*/
	         		{
	         			selector: '#outro3 > .content',
	         			//startAt: outroStart+1450,
	         			//endAt: outroStart+1800,
	         			onInit: function() {
							this.startAt = outroStart+1700 - ratio;
							this.endAt = outroStart+1900 - ratio;
     					},
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"margin-top": -450
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseOut,
	         					properties: {
	         						"margin-top": 100
	         					}
	         				}
	         			]
	         		},
	         		{
	         			selector: '#outro4 > .content > p',
	         			//startAt: outroStart+1450,
	         			//endAt: outroStart+1800,
	         			onInit: function() {
							this.startAt = outroStart+1700+eventsDelta - ratio;
							this.endAt = outroStart+1900+eventsDelta - ratio;
     					},
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"margin-top": -450
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseOut,
	         					properties: {
	         						"margin-top": 90
	         					}
	         				}
	         			]
	         		},	         		
	         		{
	         			selector: 'html.opacity #outro5 > .content > h2',
	         			//startAt: outroStart+eventsDelta+1850,
	         			//endAt: outroStart+eventsDelta+2050,
	         			onInit: function() {
							this.startAt = outroStart+2250+eventsDelta - ratio;
							this.endAt = outroStart+2400+eventsDelta - ratio;
     					},
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"opacity": 0
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseOut,
	         					properties: {
	         						"opacity": 1
	         					}
	         				}
	         			]
	         		},
	         		{
	         			selector: 'html.opacity #outro5 > .content > p',
	         			//startAt: outroStart+eventsDelta+1900,
	         			//endAt: outroStart+eventsDelta+2100,
	         			onInit: function() {
							this.startAt = outroStart+2300+eventsDelta - ratio;
							this.endAt = outroStart+2450+eventsDelta -ratio;
     					},
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"opacity": 0
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseOut,
	         					properties: {
	         						"opacity": 1
	         					}
	         				}
	         			]
	         		},
	         		{
	         			selector: 'html.opacity #outro5 > .content > .cont',
	         			//startAt: outroStart+eventsDelta+1950,
	         			//endAt: outroStart+eventsDelta+2150,
	         			onInit: function() {
							this.startAt = outroStart+2350+eventsDelta - ratio;
							this.endAt = outroStart+2500+eventsDelta - ratio;
     					},
	         			onEndAnimate:function( anim ) {},
	         			keyframes: [
	         				{ 
	         					position: 0,
	         					properties: {
	         						"opacity": 0
	         					}
	         					
	         				},
	         				{
	         					position: 1,
	         					ease: TWEEN.Easing.Sinusoidal.EaseOut,
	         					properties: {
	         						"opacity": 1
	         					}
	         				}
	         			]
	         		}         
	         		];



	// ---------------------------------------------
	// SECTIONS
	// ---------------------------------------------

	function checkSection() {
		if (checkSectionLock>0) {
			checkSectionLock--;
			return;
		}

		if ((pulseReminders>0)&&((new Date()).getTime()-lastActivity > 2000)) {
			if (startPulseScrollTeaser()) {
				pulseReminders--;
			}
		}

		var scrollTop = scrollAnimate.getScrollTop();

		//lol
		var extraFudgeFactor = Math.max(0,wHeight-1000);

		for (var i = 0; i<sectionIndex.length; i++) {
			
			var section = sectionIndex[i];
			var actualScrollTop = section.correct ? scrollTop+ratio+extraFudgeFactor : scrollTop;
			if (actualScrollTop > section.position ) {

				var sectionEnd = (i==sectionIndex.length-1) ? scrollAnimate.getMaxScroll()+ratio+extraFudgeFactor : sectionIndex[i+1].position;
				if (actualScrollTop < sectionEnd) {
					if (i>3)
						pulseReminders = 0;
					enterSection(i);
					return;
				}
				
			}
		};
	}

	function gotoSectionTag(sectionTag) {
		for (var i = 0; i<sectionIndex.length; i++) {
			if (sectionIndex[i].tag===sectionTag) {
				var newpos = sectionIndex[i].position + 1;
				//console.log(ratio);
				if (sectionIndex[i].correct == true ) 
					newpos -=ratio;
				scrollAnimate.scrollTo( newpos);
				enterSection(i);
				return;
			}
		}
	}

	function enterSection(index) {
		if (currentSection==index) {
			return;
		}
		currentSection = index;
		$('#navigation > a').each( function(i, elm){
			if (i==index) {
				$(elm).addClass('active');
			} else {
				$(elm).removeClass('active');
			}
		});
		//location.hash = sectionIndex[index].tag;
		// _gaq.push(['_trackEvent', 'Section Entered', sectionIndex[index].name]);
	}

	function initalizeNavigation() {
		var navContent = "";
		for (var i = 0; i<sectionIndex.length; i++) {
			sectionIndex[i].name = $(sectionIndex[i].id).data("navigationTag");
			navContent += "<a class='nav-link' href='"+sectionIndex[i].tag+"' data-name='"+sectionIndex[i].name+"'><div></div></a>";

		}
		//navContent += "<div id='navtip'></div><div id='navtipArrow'></div>";
		$('#navigation').html(navContent);

		$('#navigation').after("<div id='navtip'></div><div id='navtipArrow'></div>");

		$('.nav-link').click( function(e) {	
			e.preventDefault();
			var hash = this.href.substring( this.href.indexOf('#') );
			checkSectionLock = 3;
			pulseReminders = 0;
			stopPulseScrollTeaser();
			gotoSectionTag(hash);
			return false;
		});

		if (!isTouch()) {

			// var updateToolTop = function(event) {
			// 	console.log("update");
			// }

			$('#navigation').hover(
				function () {
					//$('#navtip').fadeIn(250);
					//$('#navtipArrow').fadeIn(250);
					$('#navtip').show();
					$('#navtipArrow').show();
					tooltipJustOpened = true;
					//$(this).bind('mousemove',updateToolTop);
				}, 
				function () {
					// $('#navtip').fadeOut(30);
					// $('#navtipArrow').fadeOut(30);
					$('#navtip').hide();
					$('#navtipArrow').hide();
					tooltipJustOpened = true;
					//$(this).unbind('mousemove',updateToolTop);
				}
			);

			$('.nav-link').bind( 'mouseover', function(e) {	
				//console.log("over");
				var $this = $(this);
				var $navtip = $('#navtip');
				var pos = $this.offset().left+10;

				//$('#navtipArrow').css('left',pos);
				$('#navtipArrow').stop().animate({
    				left: pos
    			},tooltipJustOpened?0:150);


				$navtip.html($this.data('name'));

				var width = $navtip .width();
				var left = Math.max(0,pos - (width/2));
				//$navtip.css('left',left);
				$navtip.stop().animate({
    				left: left
    			},tooltipJustOpened?0:150);
				tooltipJustOpened = false;
			});
		}

		enterSection(0);
	}

	// ---------------------------------------------
	// ScrollBar
	// ---------------------------------------------

	function activateScrollBar(thumbHeight) {
		scrollThumbHeight = thumbHeight;
		scrollThumbPosition = 0;
		scrollPercent = 0;
		isScrolling = false;
		$scrollBar = $('#scrollBar');
		$scrollBar.show();
		$scrollThumb = $('#scrollBar .thumb');
		$scrollThumb.css('height',scrollThumbHeight+"px");
		$scrollThumb.bind('mousedown', startScroll);
	}

	function resizeScrollBar() {
		scrollBarHeight = wHeight-60;
		$scrollBar.css('height',scrollBarHeight+"px");
		setScrollBarPosition(scrollPercent);
	}

	function startScroll(event) {
		isScrolling = true;
		thumbDelta = scrollThumbPosition - event.pageY;
		$(document).bind('mousemove', scrollUpdate);
		$(document).bind('mouseup', endScroll);
		return false;
	}

	function scrollUpdate(event) {

		scrollThumbPosition = event.pageY+thumbDelta;

		scrollThumbPosition = Math.max(0, Math.min(scrollBarHeight-scrollThumbHeight, scrollThumbPosition));

		scrollPercent = scrollThumbPosition/(scrollBarHeight-scrollThumbHeight);
		scrollPercent = Math.max(0, Math.min(1, scrollPercent));
		//Removed to improve drag scrolling
		//$scrollThumb.css('top',scrollThumbPosition);

		scrollAnimate.scrollTo( maxScroll*scrollPercent );
		return false;
	}

	function setScrollBarPosition(percent) {
		scrollThumbPosition = (scrollBarHeight-scrollThumbHeight)*percent;
		$scrollThumb.css('top',scrollThumbPosition);
	}

	function endScroll(event) {
		isScrolling = false;
		$(document).unbind('mousemove', scrollUpdate);
		$(document).unbind('mouseup', endScroll);
		return false;
	}

	// ---------------------------------------------
	// Custom overlay
	// ---------------------------------------------
	function showOverlay(opacity,inSpeed,outSpeed,contentData) {
		scrollAnimate.pause();
		$overlay.data('outSpeed',outSpeed);
		
		var contentClass;

		if (contentData!==undefined) {
			$overlay.data('contentData',contentData);

			if (contentData.type=="bgimage") {
				contentClass = ".imageOverlay";
				$overlay.after('<div class="overlayContent imageOverlay offscreen '+contentData.bgclass+'"><div id="overlayClose"><a href="#">Close</a></div></div>');
				$(contentClass).css({'width': contentData.width, 'height': contentData.height});
			} else if(contentData.type=="video") {
				contentClass = ".videoOverlay";
				if (!player) {
					
					//Generate the video tag
					$overlay.after('<div class="overlayContent videoOverlay offscreen"><div id="overlayClose"><a href="#">Close</a></div><video id="player" class="video-js vjs-default-skin" controls poster="'+contentData.poster+'" width="'+contentData.width+'" height="'+contentData.height+'" preload="auto"><source type="video/mp4" src="'+contentData.url+'" /></video></div>');
					
					//Call the video.js
					_V_("player", {}, function(){
				    	player = this;
				    	// EXAMPLE: Start playing the video.
						player.load();
				    	setTimeout(function(){player.play();}, 100);
			    	});
					
					//Center the newly created video player	
					//$('.overlayContent').css({'margin-left': -contentData.width/2, 'margin-top': -contentData.height/2});
					
				} else {
					player.src(contentData.url);
					player.size(contentData.width, contentData.height);
					player.load();
					setTimeout(function(){player.play();}, 100);
					//$('.overlayContent').css({'margin-left': -contentData.width/2, 'margin-top': -contentData.height/2});
				}				

			} else {
				$overlay.after('<div class="overlayContent"></div>');
			}

			$('.overlayContent').css({'margin-left': -contentData.width/2, 'margin-top': -contentData.height/2});
					
		}
		$('#overlayClose').fadeTo(inSpeed,1).bind('click',removeOverlay);
		$overlay.fadeTo(inSpeed,opacity,function(){
			$overlay.bind('click',removeOverlay);
			$(contentClass).removeClass('offscreen');
			$('#overlayClose').show();
		});	
	}

	function removeOverlay(e) {
		if (e)
			e.preventDefault();
		$overlay.unbind('click',removeOverlay);
		$overlay.fadeOut($overlay.data('outSpeed')||100);
		$('#overlayClose').fadeOut($overlay.data('outSpeed')||100).unbind('click',removeOverlay);
		var contentData = $overlay.data('contentData');
		if (player) {
			player.pause();
			if ($.browser.mozilla){
				player.src("");
			}
		}
		if (contentData) {
			if (contentData.closeAction=="destroy") {
				$('.overlayContent:not(.offscreen)').remove();
			}
		}
		$('.overlayContent').addClass('offscreen');

		$overlay.data('contentData',null);
		scrollAnimate.resume();
	}
	


	// ---------------------------------------------
	// Pulse Scroller
	// ---------------------------------------------

	function runPulseScrollTeaser() {
		if (!pulseScrollTeaserRunning) {
			$('#scrollTeaser').hide();
			return;
		}
		var pulseSpeed = 500;
		$('#scrollTeaser-down1').fadeIn(pulseSpeed).delay(0).fadeOut(pulseSpeed);
		$('#scrollTeaser-down2').delay(300).fadeIn(pulseSpeed).delay(0).fadeOut(pulseSpeed);
		$('#scrollTeaser-down3').delay(500).fadeIn(pulseSpeed).delay(0).fadeOut(pulseSpeed,runPulseScrollTeaser);
	}

	function startPulseScrollTeaser() {
		if (pulseScrollTeaserRunning==true)
			return false;

		pulseScrollTeaserRunning = true;
		$('#scrollTeaser').show();
		runPulseScrollTeaser();
		return true;
	}

	function stopPulseScrollTeaser() {
		pulseScrollTeaserRunning = false;
	}


	function buildGallery() {

		if (carouselLive) {
			
			 $("#slideshow").jCarouselLite({
		        btnNext: ".next",
		        btnPrev: ".prev",
				circular: false,
				visible: 5
		    });
				
			$('.gallery-thumb').hover(
			function(){
				if($(this).hasClass('inactive')) {
					$(this).stop().fadeTo(200, 0);		
				}
				$(this).parent().addClass('active');
			},
			function(){
				if($(this).hasClass('inactive')) {
					$(this).stop().fadeTo(200, 1);		
				}
				$(this).parent().removeClass('active');
			});
		

		
			$('#content-switch').css('opacity', '0');
			$('#content-switch, #content-bg').addClass('image1');
			
			$('.gallery-thumb').click(function(e){
				e.preventDefault();
				
				if ($('.animating').length > 0){return;}
				
				$this = $(this);
						
				var current = $(this).attr('href');
				$(this).addClass('animating');
				$('#content-switch').attr('class', '').addClass(current).fadeTo(2000, 1, function(){$('#content-bg').attr('class', '').addClass(current)}).fadeTo(1, 0, function(){$this.removeClass('animating');});
			});
			
		} else {
			$('#slideshowcontainer').css('display','none');
		}

	}

	// ---------------------------------------------
	// Util stuff
	// ---------------------------------------------

	function isTouch() {
		return 'ontouchstart' in window;
	}

	function track(a,b,c) {
		if (settings.tracking==true) {
		}
		//console.log("Track: "+(a?a:"-")+":"+(b?b:"-")+":"+(c?c:"-"));
	}


	function runIntro() {
		//$('#intro1content > h1').delay(300).fadeIn(300);
		//$('#intro1content > h2').delay(400).fadeIn(300);
		//$('#intro1content > p').delay(600).fadeIn(300);
	}

	function initalizePage() {

		 _V_.options.flash.swf = "videojs/video-js.swf";

		$overlay = $('#overlay');
		//showOverlay(1,0,100);

		$('.video-button').click( function(e) {	
			var overlayData = window.overlayData[$(this).data('overlayId')];
			_gaq.push(['_trackEvent', 'Overlay Opened', overlayData.trackingID]);
			showOverlay(0.8,1000,100,overlayData);
			return false;
		});


		$('.autoPlay').click( function(e) {	
			//scrollAnimate.autoScrollStart();
			//scrollAnimate.pause();
			showOverlay(0.8,1000,100,{closeAction:"destroy",width:800,height:400});
			//showOverlay(0.8,1000,100);
			return false;
		});

		$('.findOutMore').click( function(e) {	
			//scrollAnimate.autoScrollStart();
			scrollAnimate.resume();
			return false;
		});

		runIntro();

		buildGallery();

	}

	//--------------------------------------------------
	// Public & Setup
	//--------------------------------------------------
	var init = function( opts ) {
		settings = $.extend( defaults, opts );

		initalizeNavigation();
		
		if (!isTouch())
			activateScrollBar(37);
		
		// if (window.location.hash) {
		// 	//Do something
		// };

		//Create scroll animator
		scrollAnimate = ScrollAnimator();
		scrollAnimate.init({
			//Animation data
			animation: animation,
			
			//Default Settings
			maxScroll: maxScroll,		// max scroll
			useRAF : false,				// set requestAnimationFrame
			tickSpeed: 50,				// set interval (ms) if not using RAF
			scrollSpeed: 15,
			debug: false,				// turn on debug
			tweenSpeed: .2,				// scrollTop tween speed
			startAt: settings.startAt,	// scrollTop where the experience starts
			container: $('#main'),		// main container

			//Callbacks
			onStart: function() {
				//Fixme this working?
				//scrollAnimate.scrollTo(scrollAnimate.getScrollTop()-3);
			},

			//There be dragons here, no touching...
			onResize: function(page) {
				//Nasty page tidy up stuff on resize
				wHeight = page.wHeight;
				//Clamp width if needed
				wWidth = (settings.clampWidth > 0 && page.wWidth > settings.clampWidth) ? settings.clampWidth : page.wWidth;
				wCenter = page.wCenter;	
				outroComp = Math.max(0,1000-wHeight)/2;
				//Extra magic stuff here
				var pcent = (outroComp*2)/outroHeightPx;
				ratio = (outroLength*pcent);
				$('.scale').css({'width':wWidth+'px','height':wHeight+'px'});

				//Keep the horizontal start car centered under 750px
				var centerPcent = 100;
				if (wHeight<750) {
					centerPcent = ((wHeight/750)*100);
				}
				$('#horizontalSection').css('background-position','center '+centerPcent+'%');

				//$('#dimensions').html(page.wWidth+","+page.wHeight);

				if ($scrollBar) 
					resizeScrollBar();

				scrollAnimate.scrollTo(scrollAnimate.getScrollTop()+3);
				
				//Fudgy player resize stuff...
				if (player){
					var contentData = $overlay.data('contentData');
					if (wWidth < 1024) {
						player.size(700,300);
						$('.videoOverlay').css({'margin-left': -350, 'margin-top': -150});
					}
					else {
						if (contentData){
							player.size(contentData.width, contentData.height);
							$('.videoOverlay').css({'margin-left': -contentData.width/2, 'margin-top': -contentData.height/2});
						}
					}
				}
				
			},

			onUpdate: function(scrollTop) {
				updateCount++;
				if (updateCount==5) {
					stopPulseScrollTeaser();
				}
				
				//update status
				//$('#scrollTopTweened').html( (""+scrollTop).substring(0,10) );
				
				//Removed to improve drag scrolling
				//if ($scrollBar&&!isScrolling) {
				if ($scrollBar) 
					setScrollBarPosition(scrollTop/maxScroll);

				if (pulseReminders>0)
					lastActivity = (new Date()).getTime();
				pulseScrollTeaserRunning = false;
			}
		});

		initalizePage();

		//Are we debug?
		// if (scrollAnimate.isDebug()) {
		// 	$('#status').show();
		// };

		//Keyboard Controls
		// $(window).keydown(function(e) {
		// 	if (e.keyCode == 40 || e.keyCode == 39) {
		// 		var currentScroll = scrollAnimate.getScrollTop();
		// 		var targetScroll = currentScroll + 25;
		// 		if (targetScroll > scrollAnimate.getMaxScroll()+ratio) {
		// 			targetScroll = currentScroll;
		// 		}
		// 		scrollAnimate.scrollTo(targetScroll);
				
		// 	}
		// 	if (e.keyCode == 38 || e.keyCode == 37) {
		// 		var currentScroll = scrollAnimate.getScrollTop();
		// 		var targetScroll = currentScroll - 25;
		// 		if (targetScroll < 0) {
		// 			targetScroll = 0;
		// 		}
		// 		scrollAnimate.scrollTo(targetScroll);	
		// 	}
        	
		// });
		// section checks
		setInterval( checkSection, settings.sectionCheckInterval );

		return scrollAnimate;
	}

	return {
		init: init,
		scrollAnimate: scrollAnimate
	}
})();

$(document).ready( function() {
	window.siteAnimator = LandroverSite.init();
});