var express = require('express');
var Request = require('request');
var bodyParser = require('body-parser');

var app = express();

// Set up the public directory to serve our Javascript file
app.use(express.static(__dirname + '/public'));
// Set EJS as templating language
app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// Enable json body parsing of application/json
app.use(bodyParser.json());

// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//******* DATABASE Configuration *******
// The username you use to log in to cloudant.com
var CLOUDANT_USERNAME="kiprask";
// The name of your database
var CLOUDANT_DATABASE="madmaps";
// These two are generated from your Cloudant dashboard of the above database.
var CLOUDANT_KEY="astedinsingedivightseagr";
var CLOUDANT_PASSWORD="536d055cb74e71dc5f4b0f295a551fd138d172ee";

var CLOUDANT_URL = "https://" + CLOUDANT_USERNAME + ".cloudant.com/" + CLOUDANT_DATABASE;

//******* ROUTES *******
// GET - route to load the main page
app.get("/", function (request, response) {
	console.log("In main route");
	response.render('index', {title: "Notepad"});
});

app.get("/offset", function (request, response) {
	console.log("In main route");
	response.render('nyuadmap.html', {title: "Offset"});
});

// POST - route to create a new note.
app.post("/save", function (request, response) {
	console.log("Making a post!");
	// Use the Request lib to POST the data to the CouchDB on Cloudant
	Request.post({
		url: CLOUDANT_URL,
		auth: {
			user: CLOUDANT_KEY,
			pass: CLOUDANT_PASSWORD
		},
		json: true,
		body: request.body
	},
	function (err, res, body) {
		if (res.statusCode == 201){
			console.log('Doc was saved!');
			response.json(body);
		}
		else{
			console.log('Error: '+ res.statusCode);
			console.log(body);
		}
	});
});

// GET - API route to get the CouchDB data after page load.
app.get("/api", function (request, response) {
	var theNamespace = request.params.key;
	console.log('Making a db request for namespace: ' + theNamespace);
	// Use the Request lib to GET the data in the CouchDB on Cloudant
	Request.get({
		url: CLOUDANT_URL+"/_all_docs?include_docs=true",
		auth: {
			user: CLOUDANT_KEY,
			pass: CLOUDANT_PASSWORD
		},
		json: true
	}, function (err, res, body){
		//Grab the rows
		var theData = body.rows;

		if (theData){
			response.json(theData);
		}
		else{
			response.json({noData:true});
		}
	});
});


// GET - Catch All route
app.get("*", function(request,response){
	response.redirect("/");
});
var port = process.env.PORT || 3000; 
app.listen(port);
console.log('Express started on port ' + port);