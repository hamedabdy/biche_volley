#!/usr/bin/env node

var express = require('express')
    , app = express()
    , mongojs = require('mongojs')
	  , url = process.env.MONGOHQ_URL || 'mongodb://localhost/tournements'
	  , db = mongojs(url, ['bicheVolley'])
    , util = require('util')
    , bodyParser = require('body-parser')
    , database = require('./db')
    , favicon = require('serve-favicon');

app.use(bodyParser.json());
app.use(express.static(__dirname+'/'));
app.use(favicon(__dirname + '/images/favicon.ico'));

app.post('/post', function(req, res) {
  req.accepts('application/json');
  res.type('application/json');
  database.saveData(req.body);
  
  var response = {
    status  : 200,
    success : 'Updated Successfully'
  }
  res.end(JSON.stringify(response));

});


app.get('/get', function(req, res) {
  db.bicheVolley.find( '', { limit : 5000 }, function(err, result) {
    if(!err) {
      console.log(result.length);
      res.send(result); 
    } else console.log(err);
  });
});

app.post('/removeTeam', function(req, res) {
  var response = {
    status  : 200,
    success : 'Updated Successfully'
  }

  res.end(JSON.stringify(response));

  db.bicheVolley.remove(req.body, {}, function(err, result) {
    if(!err) {
      console.log("Removed Successfully\n");
    } else console.log(err);
  });
});

app.listen(process.env.PORT || 3000);
console.log('Server listening on port 3000 || ' + process.env.PORT);