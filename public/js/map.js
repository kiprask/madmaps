var map;
var cities = [];

(function init(){
  var southWest = L.latLng(-19, -65);
  var northEast = L.latLng(59, 10);
  var bounds = L.latLngBounds(southWest, northEast);
  // initalize leaflet map
  map = new L.Map('cartodb-map', {
    center: [15,15],
    zoomSnap: 0,
    zoom: 3,
    dragging: false,
    touchZoom : false,
    scrollWheelZoom : false,
    doubleClickZoom : false,
    boxZoom : false,
    tap : false,
  });

  // initialize the base layer
  L.tileLayer('https://dnv9my2eseobd.cloudfront.net/v3/cartodb.map-4xtxp73f/{z}/{x}/{y}.png', {
    attribution: 'Mapbox <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>'
  }).addTo(map);

  // viz.js JSON object that kind of works right now
  cartodb.createLayer(map, vizjson)
   .addTo(map)
   .on('done', function(layer) {
    // remove the infowindow specified in viz.json
    layer.getSubLayer(0).infowindow = null;
    // remove cities that are near New York and Sydney from the SQL query to make sure NY and Sydney show -- a bit of a hack
    var subLayerOptions = {
      sql: "SELECT * FROM ne_10m_populated_places_simple WHERE (pop_max > 1000000 OR featurecla = 'Admin-0 capital' OR name='Abu Dhabi') AND name != 'Bridgeport' AND name != 'New Haven' AND name != 'Newcastle' AND name != 'Providencetown'",
      cartocss: "#example_cartodbjs_1{marker-fill: #109DCD; marker-width: 10; marker-line-color: white; marker-line-width: 0;}",
      infowindow: null
    }
    var subLayer = layer.getSubLayer(0);
    // `name` is binded to the tooltip later on
    subLayer.setInteractivity('cartodb_id, name');
    subLayer.set(subLayerOptions);
    // interaction for that layer must be enabled
    // subLayer.setInteraction(true);
    // cdb.vis.Vis.addCursorInteraction(map, subLayer);
    layer.on('featureClick', featureClick);

    // NYU Abu Dhabi's location
    var myIcon = L.icon({
      iconUrl: '/img/nyu.png',
      iconSize: [40, 40],
    });
    L.marker([24, 54], {icon: myIcon}).addTo(map);

    // tooltip
    var testTooltip = layer.leafletMap.viz.addOverlay({
      type: 'tooltip',
      layer: subLayer,
      template: $('#tooltip_template').html(), 
      width: 200,
      position: 'bottom|right',
      fields: [{ name: 'name' }]
    });
    $('body').append(testTooltip.render().el.css('background-color', 'red'));
  }).on('error', function() {
    //log the error
  });

  function featureClick(e, latlng, pos, data) {
    cities.push(latlng);
    var AbuDhabi = [[24,54]];
    AbuDhabi.push(latlng);
    // we are using `Polyline` instead of the default `polyline`. It's a Leaflet plug-in that is imported at the top of html
    L.Polyline.Arc(AbuDhabi[0], AbuDhabi[1], {
      color: '#7addff',
      vertices: 200,
      weight: 2
    }).addTo(map);
  }
}());