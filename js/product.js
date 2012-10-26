jQuery(document).ready(function(){

    jQuery("#product-wapper").css({
        "width"  : Geometry.getViewportWidth()  + "px",
        "height" : Geometry.getViewportHeight() + "px"
    });

    jQuery(window).resize(function(){
        
        jQuery("#product-wapper").css({
            "width"  : Geometry.getViewportWidth()  + "px",
            "height" : Geometry.getViewportHeight() + "px"
        });



    });

    window.setInterval(function(){
        
        // console.log('window.scrollTop = ' + $(window).scrollTop());
        console.log('product-wapper width = ' + Geometry.getViewportWidth());
        // console.log('product-wapper height = ' + Geometry.getViewportHeight());

        console.log(jQuery(".mm-wapper").css("padding"));
        console.log(jQuery(".mm-wapper").css("width"));

        var VierPortWidth = Geometry.getViewportWidth();
        var ContentWidth = jQuery(".mm-wapper").width();

        console.log(VierPortWidth - ContentWidth);




    }, 1000);

});



