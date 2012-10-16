
var MrTimer = null;
var isWorking = false;

jQuery(document).ready(function(){
    
    jQuery("#product-info").css({

    });

    jQuery("#overlayBG").css({

    });

    jQuery("#overlayBG").hide();
    jQuery("#product-info").hide();

    jQuery("nav ul li").css({
        "border-style" : "dotted",
        "border-width" : "1px"
    });

    jQuery("#btnClick").click(function(){

        //jQuery("#overlayBG").css({
            //"height" : "100%",
            //"width"  : "100%",
            //"opacity" : "0.4",
            //"z-index" : "3"
        //}).show();

        jQuery("#product-info").show();

        jQuery("#product-info").animate({
            "height" : "200px"
        },{
            quenu : false,
            step  : function () {
                console.log('step');
            },
            duration : 600,
            complete : function () {
                console.log('done');
            }
        });

    });

    jQuery("nav ul li:eq(0)").children("a").mouseover(function(){

        console.log('mouseover');

        isWorking = true;

        jQuery("#product-info").slideToggle('slow', function(){
            isWorking = false;
        });
        //jQuery("#product-info").animate({
            //"top" : "100px"
        //},{
            //quenu : false,
            //step  : function () {
                //console.log('step');
            //},
            //duration : 600,
            //complete : function () {
                //console.log('done');
            //}
        //});
    }).mouseout(function(){
        //jQuery("#product-info").hide();

        if (isWorking == false) {
            MrTimer = window.setInterval(function(){
                console.log('Hi');
                //jQuery("#product-info").hide();
                jQuery("#product-info").slideToggle('slow');
                window.clearInterval(MrTimer);
            }, 100);
        }
    });

    jQuery("#product-info").mouseover(function(){
        console.log("mouse over");
        if (isWorking == false) {
            window.clearInterval(MrTimer);
            jQuery(this).show();
        }
    });

    jQuery("#product-info").mouseout(function(){
        console.log('mouse out');

        if (isWorking == false) {
            MrTimer = window.setInterval(function(){
                console.log('Hi');
                //jQuery("#product-info").hide();
                jQuery("#product-info").slideToggle('slow');
                window.clearInterval(MrTimer);
            }, 100);
        }

        //jQuery("#product-info").hide();

        //jQuery("#product-info").animate({
            //"height" : "0px"
        //},{
            //quenu : false,
            //step  : function () {
                //console.log('step');
            //},
            //duration : 600,
            //complete : function () {
                //console.log('done');
            //}
        //});

    });


    //jQuery("nav ul li:eq(0)").hover(function(){

        //console.log(0);
    //});

    

});
