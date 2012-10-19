var SlideShowId = 0;

jQuery(document).ready(function(){
	
	// jQuery(".homebgcontainer").hide();
	// jQuery(".homebgcontainer img").hide();
	// jQuery(".homebgcontainer").eq(0).show();
	 jQuery("#careerSlide img").eq(0).show();
	
	var container = jQuery("#careerSlide");
	var imgs = jQuery("#careerSlide img");
	var SlideShow = window.setInterval(function(){
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
				jQuery("#careerSlide img").eq(ndx).show();console.log(jQuery("#careerSlide img").eq(ndx));
				jQuery("#careerSlide img").eq(ndx).show().css({"opacity" : "0"});
				jQuery("#careerSlide img").eq(ndx).animate({
					opacity: 1
				}, { queue: true, duration: 600 });
		    }
		  });
		
		
		SlideShowId++;
		if (SlideShowId >= 3) { SlideShowId = 0 }
		
	}, 3000);
	
	// jQuery("#topnav").children().children().each(function(){
	// 					
	// 	jQuery(this).mouseenter(function(){
	// 		jQuery(this).children().each(function(){
	// 			jQuery(this).show();
	// 		});
	// 	}).mouseleave(function(){
	// 		jQuery(this).children().next().each(function(){
	// 			jQuery(this).hide();
	// 		});
	// 	});
	// 	
	// });
	
	jQuery('#newsSide .control').click(function(){
		
		window.clearInterval(SlideShow);	

	});

})
