var PRODUCT_WAPPER_MARGIN_TOP     = 0
    ,PRODUCT_WAPPER_MARGIN_LEFT   = 0
    ,PRODUCT_WAPPER_MARGIN_RIGHT  = 0
    ,PRODUCT_WAPPER_MARGIN_BOTTOM = 0;

var curImgId = 1;
var numberOfImages = 5; // Change this to the number of background images

var Goto = new Array();
Goto.push(1000);
Goto.push(5000);
Goto.push(10000);
Goto.push(15000);
Goto.push(20000);
Goto.push(25000);

var activeLayer = 0;

var currentScrollX = 0;
var lastScrollX = 0;

jQuery(document).ready(function(){

    //  initial fancybox();
    jQuery('.fancybox').fancybox();

    resize();

    jQuery(".product-wrap").css({
        "width"  : Geometry.getViewportWidth()  + "px",
        "height" : Geometry.getViewportHeight() + "px"
    });

    jQuery(window).resize(function(){
        resize();
    });

    jQuery(window).scroll(function() {
        
        currentScrollX = jQuery(window).scrollTop();

        console.log(ScrollState());

        console.log('currentScrollX = ' + currentScrollX + ' ' + ' lastScrollX = ' + lastScrollX);

        if ($(window).scrollTop() > 75) {
            jQuery(".submenu").css({'position':'fixed', 'top':'0px'});
        } else {
            jQuery(".submenu").css({'position':'relative'});
        }

        // jQuery("body").animate({ scrollTop: Goto[2] }, 1000);

        console.log($(window).scrollTop());

        if (between(0, 1000, jQuery(window).scrollTop())) {
            jQuery("body").animate({ scrollTop: Goto[1] }, 1000);
        }

        // if (between(1001, 5000, jQuery(window).scrollTop())) {
        //     jQuery("body").animate({ scrollTop: Goto[2] }, 1000);
        // }

        // if (between(50001, 10000, jQuery(window).scrollTop())) {
        //     jQuery("body").animate({ scrollTop: Goto[3] }, 1000);
        // }

        // if (between(10001, 20000, jQuery(window).scrollTop())) {
        //     jQuery("body").animate({ scrollTop: Goto[4] }, 1000);
        // }

        lastScrollX = $(window).scrollTop();

    });

    jQuery(".submenu ul li").each(function(index, value){
        if (index != 0)
            jQuery(this).children().click(function(){
                console.log(Goto[index - 1]);
                jQuery("body").animate({ scrollTop: Goto[index - 1] }, 1000);
                return false;
            });
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

    window.setInterval(function(){
        // console.log('window.scrollTop = ' + $(window).scrollTop());
    }, 1000);

    //
    //ScrollDown Animation
    //
    window.setInterval(function() {
        jQuery('.scrolldown_arrow').css('background','url(img/products/scrollDown_arrow_' + curImgId + '.png)');
        curImgId = (curImgId +1) % numberOfImages;
    }, 200);

    function between (x, y, z) {
        if ((z >= x) && (z <= y)) {
            return true;
        } else {
            return false;
        }
    }

    function ScrollState() {
        return (currentScrollX >= lastScrollX) ? "DOWN" : "UP";
    }

});



