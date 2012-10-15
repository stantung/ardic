<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>GMaps.js &mdash; Overlays</title>
  <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
  <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
  <script type="text/javascript" src="<?php echo base_url() ?>js/gmaps.js"></script>
  <link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.3.0/bootstrap.min.css" />
  <!-- <link rel="stylesheet" type="text/css" href="examples.css" /> -->

<style type="text/css" media="screen">
body{
  font-family: 'Droid Sans', 'Helvetica', Arial, sans-serif;
  margin:5px;
}
#map{
  display: block;
  width: 95%;
  height: 350px;
  margin: 0 auto;
  -moz-box-shadow: 0px 5px 20px #ccc;
  -webkit-box-shadow: 0px 5px 20px #ccc;
  box-shadow: 0px 5px 20px #ccc;
}
#map.large{
  height:500px;
}

.overlay{
  display:block;
  text-align:center;
  color:#fff;
  font-size:60px;
  line-height:80px;
  opacity:0.8;
  background:#4477aa;
  border:solid 3px #336699;
  border-radius:4px;
  box-shadow:2px 2px 10px #333;
  text-shadow:1px 1px 1px #666;
  padding:0 4px;
}

.overlay_arrow{
  left:50%;
  margin-left:-16px;
  width:0;
  height:0;
  position:absolute;
}
.overlay_arrow.above{
  bottom:-15px;
  border-left:16px solid transparent;
  border-right:16px solid transparent;
  border-top:16px solid #336699;
}
.overlay_arrow.below{
  top:-15px;
  border-left:16px solid transparent;
  border-right:16px solid transparent;
  border-bottom:16px solid #336699;
}

#map {
	background-image: url(img/open-source-cloud.jpeg);
}

</style>

  <script type="text/javascript">

var styles = [
  {
    stylers: [
      { hue: "#dddddd" },
      { saturation: -100 }
    ]
  },{
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { lightness: 100 },
      { visibility: "simplified" }
    ]
  },{
    featureType: "road",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  }
];

	  //     var map;
	  //     $(document).ready(function(){
	  //       map = new GMaps({
	  //         el: '#map',
	  //         lat: -12.043333,
	  //         lng: -77.028333
	  //       });
	  //       map.drawOverlay({
	  //         lat: map.getCenter().lat(),
	  //         lng: map.getCenter().lng(),
	  //         layer: 'overlayLayer',
	  //         content: '<div class="overlay">Hamm<div class="overlay_arrow above">Hello, World</div><img src="data:image/jpeg;base64,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"></div>',
	  //         verticalAlign: 'top',
	  //         horizontalAlign: 'center'
	  //       });
	  // 
	  // map.setOptions({styles: styles});
	  // 
	  //     });
	
	
    var map;
    $(document).ready(function(){
      map = new GMaps({
        el: '#map',
        lat: -12.043333,
        lng: -77.028333
      });
      map.addMarker({
        lat: -12.043333,
        lng: -77.03,
        title: 'Lima',
        details: {
          database_id: 42,
          author: 'HPNeo'
        },
        click: function(e){
          if(console.log)
            console.log(e);
          alert('You clicked in this marker');
        },
        mouseover: function(e){
          if(console.log)
            console.log(e);
        }
      });
      map.addMarker({
        lat: -12.042,
        lng: -77.028333,
        title: 'Marker with InfoWindow',
        infoWindow: {
          content: '<p>HTML Content</p>'
        }
      });

		map.setOptions({styles: styles});

    });
	
  </script>


</head>
<body>
  <h1>GMaps.js &mdash; Overlays</h1>
  <div class="row">
    <div class="span11">
      <div id="map"></div>
    </div>
    <div class="span6">
      <p>You can add overlays using:</p>
      <pre>map.drawOverlay({
  lat: -12.043333,
  lng: -77.028333,
  content: '&lt;div class="overlay"&gt;Lima&lt;/div&gt;'
});</pre>
      <p>You must define <strong>latitude</strong>, <strong>longitude</strong> and the <strong>content</strong> of the map overlay.</p>
      <p><span class="label notice">Note: </span>Also, you must define a <strong>height</strong> to the <strong>content</strong>.</p>
      <p><span class="label notice">Note: </span>Also, you can define a <code>verticalAlign</code>, which can be <code>top</code>, <code>middle</code> or <code>bottom</code>, and <code>horizontalAlign</code>, which can be <code>left</code>, <code>center</code> or <code>right</code>.</p>
    </div>
  </div>
</body>
</html>
