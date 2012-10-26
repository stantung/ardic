jQuery(document).ready(function(){

    jQuery("#product-wapper").css({
        "width"  : Geometry.getViewportWidth()  + "px",
        "height" : Geometry.getViewportHeight() + "px"
    });

    jQuery("section").each(function(index, value){
        jQuery(this).width(Geometry.getViewportWidth());
        jQuery(this).height(Geometry.getViewportHeight());
    });

    // jQuery(".mm-warp").each(function(index, value){
    //     jQuery(this).height(jQuery(this).parent().height());
    // });

    jQuery(window).resize(function(){
        
        // jQuery("#product-wapper").css({
        //     "width"  : Geometry.getViewportWidth()  + "px",
        //     "height" : Geometry.getViewportHeight() + "px"
        // });

        // jQuery(".mm-warp").each(function(index, value){
        //     jQuery(this).height(jQuery(this).parent().height());
        // });

        jQuery("section").each(function(index, value){
            jQuery(this).width(Geometry.getViewportWidth());
            jQuery(this).height(Geometry.getViewportHeight());
        });

    });

    window.setInterval(function(){
        
        console.log('window.scrollTop = ' + $(window).scrollTop());
        // console.log('product-wapper width = ' + Geometry.getViewportWidth());
        // // console.log('product-wapper height = ' + Geometry.getViewportHeight());

        // console.log(jQuery(".mm-wapper").css("padding"));
        // console.log(jQuery(".mm-wapper").css("width"));

        // var VierPortWidth = Geometry.getViewportWidth();
        // var ContentWidth = jQuery(".mm-wapper").width();

        // console.log(VierPortWidth - ContentWidth);

        // jQuery("#product-wapper").height(Geometry.getViewportHeight());



    }, 1000);

});



