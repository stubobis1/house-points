// set up ======================================================================
var express = require('express');
var app = express(); 						// create our app w/ express
var port = process.env.PORT || 8080; 				// set the port
var morgan = require('morgan');


// configuration ===============================================================

app.use(express.static('./public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console



// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
