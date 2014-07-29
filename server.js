#!/usr/bin/env node

var express = require('express')
    , app = express()
    , mongojs = require('mongojs')
	  , url = process.env.MONGOHQ_URL || 'mongodb://localhost/tournements'
	  , db = mongojs(url, ['bicheVolley'])
    , util = require('util')
    , bodyParser = require('body-parser')
    , database = require('./db');
	//  , flash = require('connect-flash')
	//  , passport = require('passport')
	//  , LocalStrategy = require('passport-local').Strategy
	//  , db2 = mongojs(url, ['htpasswd'])
	 // , bcrypt = require('bcrypt');
  
// configure Express
 // app.disable('x-powered-by');
  //app.use(express.logger());
 // app.set('views', __dirname + '/views');
  //app.set('view engine', 'ejs');
  //app.use(express.cookieParser());
  //app.use(express.bodyParser());
  //app.use(express.methodOverride());
  //app.use(express.session({secret: 'concert_dacote'}));
  // Initialize Passport! Also use passport.session() middleware, to support
  // persistent login sessions (recommended)
//  app.use(flash());
//  app.use(passport.initialize());
//  app.use(passport.session());
  //app.use(app.router);
  //app.use(express.compress());
  app.use(bodyParser.json());
  app.use(express.static(__dirname+'/'));

app.post('/post', function(req, res) {
  console.log("REQ ====>> " + util.inspect(req.body) );
  console.log("RES ====>> " + util.inspect(res.body) );
  console.log("RESPONSE STATUS => " + res.statusCode);
  query = '{ "team_id": "' + req.body.team_id + '", "name" : "' 
    + req.body.name + '", "captain" : "' + req.body.captain + '" }';
  query = JSON.parse(query);
  database.insertData(query, req.body);
});


app.get('/get', function(req, res) {
  console.log("REQ ====>> " + util.inspect(req.body) );
  console.log("RES ====>> " + util.inspect(res.body) );
  console.log("RESPONSE STATUS => " + res.statusCode);

  db.bicheVolley.find( '', { limit : 5000 }, function(err, result) {
    if(!err) {
      console.log(result.length);
      res.send(result); 
    } else console.log(err);
  });

});


app.listen(process.env.PORT || 3000);
console.log('Server listening on port 3000 || ' + process.env.PORT);