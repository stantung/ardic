jQuery(document).ready(function(){
	var tabContents = jQuery('#tabContentWrap li');
	var tabControls = jQuery('.tabControler li');

	tabControls.click(function(){
		// clickTab = $(this).attr('id');
		clickTab = $(this).index(); 

		if (clickTab == 0){	
			activeTabId = 0;
			unactiveId1 = 1;
			unactiveId2 = 2;
		} else if (clickTab == 1){
			activeTabId = 1;
			unactiveId1 = 0;
			unactiveId2 = 2;
		} else if (clickTab == 2){
			activeTabId = 2;
			unactiveId1 = 1;
			unactiveId2 = 0;
		}

		tabsAct(activeTabId, unactiveId1, unactiveId2);

	});

	function tabsAct(activeId, unactiveId1, unactiveId2){
		
		jQuery.each(tabControls,function(){
			console.log(this);
			jQuery(this).removeClass('active left right');
		});
		tabControls.eq(unactiveId1).addClass('left');
		tabControls.eq(unactiveId2).addClass('right');
		tabControls.eq(activeId).addClass('active');
		
		tabContents.eq(unactiveId1).fadeOut(300);		
		tabContents.eq(unactiveId2).fadeOut(300);
		tabContents.eq(activeId).fadeIn(300);
	}

	jQuery('#tabContentWrap .mapList').click(function(){
		var clicked = jQuery(this);
		// console.log(clicked); 
		clicked.parent().find('.open').removeClass('open').addClass('close');
		clicked.removeClass('close').addClass('open');
		
	});
});