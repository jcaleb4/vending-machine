var express = require('express'),
	app = express(), // Web framework to handle routing requests
	MongoClient = require('mongodb').MongoClient, // Routes for our application
	routes = require('./routes');

MongoClient.connect('mongodb://localhost:27017/vending', function(err, db) {
	"use strict";
	if(err) throw err;

	// Register our templating engine
	app.set('view engine', 'jade');
	app.set('views', __dirname + '/views');
	app.use(express.static(__dirname + '/public'));

	// Express middleware to populate 'req.body' so we can access POST variables
	app.use(express.bodyParser());
	
	// Application routes
	routes(app, db);

	app.listen(4000);
	console.log('Express server listening on port 4000');
});
