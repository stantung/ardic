/*
 *
 *  Home page Slider.
 *
* */
jQuery(document).ready(function(){
    
    jQuery('#slider').nivoSlider({
        effect:'fade',
        pauseTime: 6000,
        controlNav: true,
        controlNavThumbs: false,
        directionNav: false
    });

    jQuery('.newsContent').eq(0).css('display','block');
    jQuery('.newsSwitch').eq(0).removeClass('close').addClass('open');
    var newsClick;
	jQuery('.newsSwitch').click(function(){
		
		// var newsContent = jQuery(this).next('.newsContent');
		// if(jQuery(this).hasClass('open')){
		// 	newsContent.slideUp('fast');
		// 	jQuery(this).removeClass('open');
		// }else{
		// 	newsContent.slideDown('fast');
		// 	jQuery(this).addClass('open');
		// }

		newsClick = jQuery(this);
		indexNewsTab(newsClick);
		
	});
	jQuery('.newsList li h5').click(function(){
		newsClick = jQuery(this).siblings('.newsSwitch');
		indexNewsTab(newsClick);
	});

	function indexNewsTab(newsClick){
		var newsContent = newsClick.next('.newsContent');
		if(newsClick.hasClass('open')){
			newsContent.slideUp('fast');
			newsClick.removeClass('open');
		}else{
			newsContent.slideDown('fast');
			newsClick.addClass('open');
		}
	}

});

