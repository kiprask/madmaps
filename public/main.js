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
  return deg * (Math.PI/180)
}

var lat_1 = 19;
var lon_1 = 72;

var lat_2 = -34;
var lon_2 = -58;

var d = getDistanceFromLatLonInKm(lat_1,lon_1,lat_2,lon_2);

console.log(d);


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

$(document).ready(function(){
	console.log("Page Loaded!");

	$("#submitBtn").click(function () {

		console.log("submit button clicked!");

		var data = {
			name: $("#username").val() || "ME",
			netID: $("#netID").val() || "ab123",
			created_at: new Date()
		};

		//Send the data to our saveRecord function
		saveRecord(data);

		//Return false to prevent the form from submitting itself
		return false;
	});
});
