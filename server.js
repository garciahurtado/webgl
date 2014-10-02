/**
 *  server.js
 */

// Import the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express

var port = process.env.PORT || 8080; 		// set our port

app.use(express.static(__dirname + '/public')); 	

app.listen(port);
console.log('Static server running on port ' + port);
