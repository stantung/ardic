var is_open = false;
var is_hover = false;

jQuery(document).ready(function(){

    jQuery("#product-info").hover(function(){
        is_open = true;
    }, function(){
        is_open = false;
    });

    jQuery("nav ul li").each(function(index, value){
        if (index == 0) {
            jQuery(this).children("a").hover(function(){
                is_hover = true;
            }, function(){
                is_hover = false;
            });
        } else {

        }
    });

    var ProductSlide = window.setInterval(function(){
        //console.log('is_hover = ' + is_hover + ' is_open  = ' + is_open);
        if (is_hover == true) {
            jQuery("#product-info").slideDown('slow');
        } else {
            if (is_open == false) {
                jQuery("#product-info").slideUp('slow');
            }
        }
    }, 600);
});
