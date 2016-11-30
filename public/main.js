// Distance calculator found here
// http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
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

var lat_1 = 19;
var lon_1 = 72;

var lat_2 = -34;
var lon_2 = -58;

var d = getDistanceFromLatLonInKm(lat_1,lon_1,lat_2,lon_2);

console.log(d);

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

console.log(emissionScoreCalculator(4000));

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

$(document).ready(function(){
	console.log("Page Loaded!");

	$("#submitBtn").click(function () {

		console.log("submit button clicked!");

		var data = {
			name: $("#username").val() || "ME",
			netID: $("#netID").val() || "ab123",
			coordinates: $("#coordinates").val() || [{lat:54, long:25}, {lat:77, long:22}],
			tGPA: parseFloat($("#tGPA").val()).toFixed(2) || 9000,
			total: $("#total").val() || "150000",
			created_at: new Date()
		};

		//Send the data to our saveRecord function
		saveRecord(data);

		//Return false to prevent the form from submitting itself
		return false;
	});

	$("#getAllBtn").click(function() {
		console.log("getAll button clicked!");

		getAllData();
	});
});
