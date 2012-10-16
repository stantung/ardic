/*
 *
 *  Home page Slider.
 *
* */
jQuery(document).ready(function(){
    //jQuery('#slider').nivoSlider({
        //effect:'fade',
        //pauseTime: 6000,
        //controlNav: true,
        //controlNavThumbs: false
    //});

	jQuery('.newsSwitch').click(function(){
		console.log(jQuery(this).next('.newsContent'));
		var newsContent = jQuery(this).next('.newsContent');
		if(jQuery(this).hasClass('open')){

			newsContent.slideUp('fast');
			jQuery(this).removeClass('open');

		}else{

			newsContent.slideDown('fast');
			jQuery(this).addClass('open');

		}
		
	});
});

