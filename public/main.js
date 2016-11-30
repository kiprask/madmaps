


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
