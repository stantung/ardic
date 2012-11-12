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
            $("#overlayBG").show().animate({
                 "display" : ""
                ,"opacity" : "0.5"
				,"z-index" : "99999997"
            }, { quenu : false, step : function () {
                jQuery(".product-arrar").attr('src', 'img/productArrowRed.png');
                jQuery("#product-info").slideDown('slow', function(){
                });
            }, duration : 800, complete : function () {
            }});

        } else {
            if (is_open == false) {
                $("#overlayBG").animate({
                     "display" : ""
                    ,"opacity" : "0"
					,"z-index" : "-1"
                }, { quenu : false, step : function () {
                    jQuery("#product-info").slideUp('slow', function(){  });
                }, duration : 300, complete : function () {
                    jQuery(".product-arrar").attr('src', 'img/productArrow.png');
                }});

            }
        }
    }, 600);

    jQuery("#backToTop").click(function(){
        jQuery("html body").animate({
            scrollTop: '0px'
        },1000);
    });

});
        $(function(){

          $(".jpWrap-media").jPages({
            containerID : "itemContainer-media",
            perPage: 6,
            links:"blank",
            callback: function(pages){
                $('#legend-media').html(pages.current+"/"+pages.count);
            }
          });
          $(".jpWrap-ap").jPages({
            containerID : "itemContainer-ap",
            perPage: 4,
            links:"blank",
            callback: function(pages){
                $('#legend-ap').html(pages.current+"/"+pages.count);
            }
          });
          $(".jpWrap-ts").jPages({
            containerID : "itemContainer-ts",
            perPage: 6,
            links:"blank",
            callback: function(pages){
                $('#legend-ts').html(pages.current+"/"+pages.count);
            }
          });

        });
