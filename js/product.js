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

    jQuery(window).scroll(function() {
        
        // console.log(jQuery(this).scrollTop());
        // console.log(
        //     "Y = " + jQuery(this).scrollTop() +
        //     " between = " + between(0, 300, jQuery(this).scrollTop())
        // );

        // if (between(0, 300, jQuery(this).scrollTop())) {
        //     jQuery("#main nav").css({"top" : "-" + jQuery(this).scrollTop() + "px"});
        //     // console.log(jQuery("#main nav").css("top"));
        // }

        // if (between(300, 0, jQuery(this).scrollTop())) {
        //     jQuery("#main nav").css({"top" : "+=1px"});
        // }

        // if (between(0, jQuery(".submenu").offset().top, jQuery(this).scrollTop())) {
        //     console.log("QQ = " + jQuery(".submenu").offset().top);
        //     jQuery(".submenu").css({
        //         "top" : "75px"
        //     });
                    
                    if( $(window).scrollTop() > 75)         
                        jQuery(".submenu").css({'position':'fixed', 'top':'0px'});
                    else
                        jQuery(".submenu").css({'position':'relative'});             

            // jQuery(".submenu").css({      
            //      ,"position" : "fixed"
            //  });
        // }

    })

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
        }

        jQuery(".content-wrap").each(function(index, value){
            jQuery(this).css({
                 "top"  : (Geometry.getViewportHeight() / 2) - 230 + "px"
            });
        });

        jQuery(".content-wrap-580").each(function(index, value){

            var 
                _CONTENT_WRAP_580_X      = 0,
                _CONTENT_WRAP_580_Y      = jQuery(this).offset().left,
                _CONTENT_WRAP_580_HEIGHT = jQuery(this).height(),
                _CONTENT_WRAP_580_WIDTH  = jQuery(this).width();

            //  需要重新計算 X 座標
            _CONTENT_WRAP_580_X = (Geometry.getViewportHeight() / 2) - 230 + "px";

            jQuery(this).css({
                 "top"  : _CONTENT_WRAP_580_X
            });

            if (jQuery(this).find('.scrollWindow')) {

                var _x = 0,
                    _y = 0,
                    _h = 0,
                    _w = 0;

                _h = jQuery(this).height() / 2;
                _x = jQuery(this).offset().top - _h + "px";

                jQuery(this).find('.scrollWindow').css({
                    "top" : "-206px"
                });
            }

        });

        jQuery(".textWindow").each(function(index, value){
            jQuery(this).children('div').css({
                "top" : jQuery(this).parent().height() / 3 + "px"
            });
        });

    }
    //
    //ScrollDown Animation
    //
        (function() {
            var curImgId = 1;
            var numberOfImages = 5; // Change this to the number of background images
            window.setInterval(function() {
                jQuery('.scrolldown_arrow').css('background','url(img/products/scrollDown_arrow_' + curImgId + '.png)');
                curImgId = (curImgId +1) % numberOfImages;
            }, 200);
        })();
    //
    //end Scroll Down Animation
    //
    window.setInterval(function(){
        
        console.log('window.scrollTop = ' + $(window).scrollTop());

        // console.log(jQuery(".features").offset().top);
        // console.log(jQuery(".features").width());
        // console.log(jQuery(".features").height());


    }, 1000);

    function between (x, y, z) {
        if ((z >= x) && (z <= y)) {
            return true;
        } else {
            return false;
        }
    }

});



