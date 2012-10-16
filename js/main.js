

var isWorking = false;

jQuery(document).ready(function(){

    jQuery("#product-info").hide();

    jQuery("nav ul li:eq(0)").children("a").mouseover(function(){

        jQuery("#product-info").slideToggle('slow', function(){
            isWorking = false;
        });



    });

});
