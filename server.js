// set up ======================================================================
let express = require('express');
let app = express(); 						// create our app w/ express
let port = process.env.PORT || 80; 				// set the port
let morgan = require('morgan');


// configuration ===============================================================

//app.use(express.static('./public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console



// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
