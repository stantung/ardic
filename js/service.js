jQuery(document).ready(function(){
	var tabContents = jQuery('#tabContentWrap li');
	var tabControls = jQuery('#servicesIntro ul li');

	//tabContents.eq(0).css('width','980px');
	tabControls.eq(0).addClass('active');
	tabContents.eq(0).addClass('active');

	jQuery('#servicesIntro li').click(function(){
		clickTab = $(this).attr('id');

		
		if (clickTab == 'technical'){	
			activeTabId = 0;
			unactiveId1 = 1;
			unactiveId2 = 2;
		} else if (clickTab == 'demo'){
			activeTabId = 1;
			unactiveId1 = 0;
			unactiveId2 = 2;
		} else if (clickTab == 'sample'){
			activeTabId = 2;
			unactiveId1 = 1;
			unactiveId2 = 0;
		}

		tabsAct(activeTabId, unactiveId1, unactiveId2);

	});

	function tabsAct(activeId, unactiveId1, unactiveId2){
		
		tabControls.eq(unactiveId1).removeClass('active');
		tabControls.eq(unactiveId2).removeClass('active');
		tabControls.eq(activeId).addClass('active');
		
		tabContents.eq(unactiveId1).fadeOut(300);		
		// tabContents.eq(unactiveId1).animate({
		// 	width: 0
		// }, 400);
		tabContents.eq(unactiveId2).fadeOut(300);
		// tabContents.eq(unactiveId2).animate({
		// 	width: 0
		// }, 400);
		tabContents.eq(activeId).fadeIn(300);
		// tabContents.eq(activeId).animate({
		// 	width: 980
		// }, 400);


	}
});