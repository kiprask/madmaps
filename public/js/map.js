var map;
var cities = [];
var score = 0;

function init(){
  var southWest = L.latLng(-67, -173);
  var northEast = L.latLng(76, 179);
  var bounds = L.latLngBounds(southWest, northEast);
  // initalize leaflet map
  map = new L.Map('cartodb-map', {
    center: [15,15],
    zoom:3,
    zoomSnap: 0,
    maxBounds: bounds,
    minZoom: 2,
    wakeTime: 500,
    sleepOpacity: .8,
    sleepTime: 500
  });

  // initialize the base layer
  L.tileLayer('https://dnv9my2eseobd.cloudfront.net/v3/cartodb.map-4xtxp73f/{z}/{x}/{y}.png', {
    attribution: 'Mapbox <a href="https://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>'
  }).addTo(map);

  // viz.js JSON object that kind of works right now
  cartodb.createLayer(map, vizjson)
   .addTo(map)
   .on('done', function(layer) {
    // remove the infowindow specified in viz.json
    layer.getSubLayer(0).infowindow = null;
    // remove cities that are near New York and Sydney from the SQL query to make sure NY and Sydney show -- a bit of a hack
    var subLayerOptions = {
      // sql: "SELECT * FROM ne_10m_populated_places_simple WHERE featurecla IN ('Admin-0 capital')",
      sql: "SELECT * FROM ne_10m_populated_places_simple WHERE (pop_max > 1000000 OR featurecla = 'Admin-0 capital' OR name='Abu Dhabi') AND name NOT IN ('Bridgeport', 'New Haven', 'Newcastle', 'Providence', 'Nezahualcoyotl', 'Toluca', 'Zumpango', 'Puebla', 'Evanston', 'Waukegan', 'Aurora')",
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
    score += getDistanceFromLatLonInKm(latlng[0],latlng[1]);
    console.log(score);
    var AbuDhabi = [[24,54]];
    AbuDhabi.push(latlng);
    // we are using `Polyline` instead of the default `polyline`. It's a Leaflet plug-in that is imported at the top of html
    L.Polyline.Arc(AbuDhabi[0], AbuDhabi[1], {
      color: '#7addff',
      vertices: 200,
      weight: 2
    }).addTo(map);
  }
};

// Distance calculator found here
// http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula

function getDistanceFromLatLonInKm(lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  // Abu Dhabi's coordinates
  var lat1 = 24.2992;
  var lon1 = 54.6973;
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// Parameters and calculator from here: http://co2.myclimate.org/
function emissionScoreCalculator(x){
  // E = ((ax^2+bx+c)/(S*PLF))*(1-CF)*(CW)*(EF*M+P)
  // x is the flight distance
  // 2.0 tonnes per year - an average person
  var s = 280.39;
  var plf = 0.77;
  var dc = 125;
  var cf = 1-0.951;
  var cw = 1.05;
  var ef = 3.15;
  var p = 0.51;
  var m = 2;
  var a = 0.000134576;
  var b = 6.1798;
  var c = 3446.20;

  var e = ((a*(x^2)+b*x+c)/(s*plf))*(1-cf)*(cw)*(ef*m+p);
  // returns co2 emission in tonnes
  return e/1000;
}

function saveRecord (theData) {
  // Set the namespace for this note
  theData.namespace = window.key;
  console.log("Trying to Post");

  $.ajax({
    url: "/save",
    contentType: "application/json",
    type: "POST",
    data: JSON.stringify(theData),
    error: function (resp) {
      console.log(resp);
      alert("Something went wrong. Try another post!");
    },
    success: function (resp) {
      console.log(resp);
      // // Render the note
      // var htmlString = noteTemplate(theData);
      // $("#notes").append(htmlString);

      // Empty the form.
      $("#username").val("");
      $("#netID").val("");
      // Deselect the submit button.
      $("#submitBtn").blur();
    }
  });
}

function getAllData(){

  $.ajax({
    url: "/api",
    type: "GET",
    data: JSON,
    error: function(resp){
      console.log(resp);
      alert("Error getting data. Refresh and try again!");
    },
    success: function (d) {
      console.log(d);
      
      var allGPA = 0;
      //loop through every piece of data to get overall tGPA
      for (var i=0; i<d.length; i++){
        allGPA += Number(d[i].doc.tGPA);
      }
      console.log(allGPA);
      $("#overallGPA").html(allGPA);
    }
  });
}

function updateBG() {
  var bgArray = ["../img/bg.jpg", "../img/campus.jpg", "../img/campus2.jpg"];
  var i = 0;

  setInterval(function() {  
    i++;
    if (i > 2) i = 0;
    $(".header").css({"background": "url(" + bgArray[i]+") no-repeat center center scroll",
             "-webkit-background-size" : "cover",
               "-moz-background-size": "cover",
               "background-size" : "cover",
               "-o-background-size" : "cover"}
    );
  }, 5000);
}

$(document).ready(function(){
  console.log("Page Loaded!");
  $("#results").hide();
  init();
  updateBG();

  $("#submitBtn").click(function () {
    console.log("submit button clicked!");
    score = 2*score;
    var emissionScore = emissionScoreCalculator(score);
    console.log(emissionScore);
    var data = {
      name: $("#username").val() || "ME",
      netID: $("#netID").val() || "ab123",
      coordinates: cities || [{}],
      tGPA: parseFloat(emissionScore).toFixed(2) || 0,
      created_at: new Date()
    };

    //Send the data to our saveRecord function
    saveRecord(data);
    $("#results").show();
    for (var i = 0; i < 20; i++){
      $("#addPeopleHere").append('<div class="col-md-1"> <img class="img-human img-responsive" src="img/human.png"> </div>')  
    }
    $("#addExamplePersonHere").append('<div class="col-md-1"> <img class="img-human img-responsive" id="main" src="img/human.png"> </div>'); 
    //Return false to prevent the form from submitting itself
    return false;
  });

  $("#getAllBtn").click(function() {
    console.log("getAll button clicked!");
    getAllData();
  });
});