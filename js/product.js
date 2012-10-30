var PRODUCT_WAPPER_MARGIN_TOP     = 0
    ,PRODUCT_WAPPER_MARGIN_LEFT   = 0
    ,PRODUCT_WAPPER_MARGIN_RIGHT  = 0
    ,PRODUCT_WAPPER_MARGIN_BOTTOM = 0;

jQuery(document).ready(function(){

    resize();

    jQuery(".product-wrap").css({
        "width"  : Geometry.getViewportWidth()  + "px",
        "height" : Geometry.getViewportHeight() + "px"
    });

    jQuery("section").each(function(index, value){
        // jQuery(this).width(Geometry.getViewportWidth());
        // jQuery(this).height(Geometry.getViewportHeight());
    });

    // jQuery(".mm-warp").each(function(index, value){
    //     jQuery(this).height(jQuery(this).parent().height());
    // });

    jQuery(window).resize(function(){
        resize();
    });

    function resize () {



        if (Geometry.getViewportWidth() > 1600) {
            PRODUCT_WAPPER_MARGIN_LEFT  = ((Geometry.getViewportWidth() - 1600) / 2);
            // PRODUCT_WAPPER_MARGIN_RIGHT = ((Geometry.getViewportWidth() - 1600) / 2);
            // PRODUCT_WAPPER_MARGIN_TOP    = ((1000 - Geometry.getViewportHeight()) / 2);
            // PRODUCT_WAPPER_MARGIN_BOTTOM = ((1000 - Geometry.getViewportHeight()) / 2);
           jQuery(".product-wrap").css({
                "width"  : Geometry.getViewportWidth()  + "px",
                "height" : Geometry.getViewportHeight() + "px",
                "padding-top"    : PRODUCT_WAPPER_MARGIN_TOP    + "px",
                "padding-left"   : PRODUCT_WAPPER_MARGIN_LEFT   + "px",
                "padding-right"  : PRODUCT_WAPPER_MARGIN_RIGHT  + "px",
                "padding-bottom" : PRODUCT_WAPPER_MARGIN_BOTTOM + "px"
            });
        } else {

            PRODUCT_WAPPER_MARGIN_TOP    = ((Geometry.getViewportHeight() - 1600) / 2);
            PRODUCT_WAPPER_MARGIN_LEFT   = ((Geometry.getViewportWidth() - 1600) / 2);
            PRODUCT_WAPPER_MARGIN_RIGHT  = 0;
            PRODUCT_WAPPER_MARGIN_BOTTOM = 0;

            jQuery(".product-wrap").css({
                "width"  : Geometry.getViewportWidth()  + "px",
                "height" : Geometry.getViewportHeight() + "px",
                "margin-top"    : PRODUCT_WAPPER_MARGIN_TOP    + "px",
                "margin-left"   : PRODUCT_WAPPER_MARGIN_LEFT   + "px",
                "margin-right"  : PRODUCT_WAPPER_MARGIN_RIGHT  + "px",
                "margin-bottom" : PRODUCT_WAPPER_MARGIN_BOTTOM + "px",
                "padding-top"    : "0px",
                "padding-left"   : "0px",
                "padding-right"  : "0px",
                "padding-bottom" : "0px"
            });

            jQuery(".content-wrap").each(function(index, value){
                jQuery(this).css({
                     "top"  : (Geometry.getViewportHeight() / 2) - 230 + "px"
                });
            });
        }
    }

    window.setInterval(function(){
        // console.log('window.scrollTop = ' + $(window).scrollTop());
    }, 1000);

});



