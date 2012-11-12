var SlideShowId = 0;
var MrTimer = 0;	 
var container = jQuery("#careerSlide");
var imgs = jQuery("#careerSlide img");


jQuery(document).ready(function(){
	
	jQuery("#careerSlide img").eq(0).show();

	var MainSlide = function (_interval) {
		this.interval = _interval;		
	}

	MainSlide.prototype.play = function () {		
		MrTimer = window.setInterval(function(){
			
			// do 
			// console.log('MrTimer = ' + MrTimer);

			var ndx = (SlideShowId + 1);
			if (ndx >= 3) { ndx = 0 };
			$(imgs[SlideShowId]).animate({
				opacity : 0
			  }, {
				queue: true,
			    duration: 600,
				step: function(now, fx) {

				},
			    complete: function() {
					// jQuery(".homebgcontainer").hide();
					//jQuery("#careerSlide img").eq(ndx).show();console.log(jQuery("#careerSlide img").eq(ndx));
					
					jQuery("#careerSlide img").eq(ndx).show().css({"opacity" : "0"});

					jQuery("#careerSlide img").eq(ndx).animate({
						opacity: 1
					}, { queue: true, duration: 600 });
			    }
			  });
			
			
			SlideShowId++;
			if (SlideShowId >= 3) { SlideShowId = 0 }



		}, this.interval);
	}

	MainSlide.prototype.stop = function () {
		//console.log('stop = ' + MrTimer);

		jQuery("#careerSlide img").css({"opacity" : "0"}).fadeOut('slow');

		window.clearInterval(MrTimer);
	}

	MainSlide.prototype.prev = function () {		

		this.stop();

		SlideShowId--;

		//console.log(SlideShowId);

		if (SlideShowId < 0) { SlideShowId = 2 }
		
		//console.log(SlideShowId);

		//console.log(jQuery(imgs[SlideShowId]));

		jQuery(imgs[SlideShowId]).css({"opacity" : "1"}).fadeIn('slow');

		this.play();
	}

	MainSlide.prototype.next = function () {		
		this.stop();

		SlideShowId++;
		if (SlideShowId >= 3) { SlideShowId = 0 }
		// console.log(SlideShowId);
		jQuery(imgs[SlideShowId]).css({"opacity" : "1"}).fadeIn('slow');
		this.play();
	}	

	var MyMainSlide = new MainSlide(5000);
	MyMainSlide.play();

	jQuery('#newsSide .control').click(function(){
		var action = jQuery(this).attr('id');
		if(action == 'next'){
			MyMainSlide.next();	
		} else {
			MyMainSlide.prev();
		}
		return false;
	});


})
