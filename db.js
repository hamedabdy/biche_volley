#!/usr/bin/env node

var mongojs = require('mongojs'),
    dburl = process.env.MONGOHQ_URL || 'mongodb://localhost/tournements',
	db = mongojs(dburl, ['bicheVolley']);

/*
 * inserting data into database
 */
function insertData(query, data) {
    db.bicheVolley.update(query, data, {continueOnError: true, upsert: true}, function(err, docs){
       if(err) console.log('err: ' + err + '\n');
       else console.log('data inserted successfully!\n');
   });
}

function dropCollection(){
	db.bicheVolley.drop();
}

function ensureIndex(){
	db.bicheVolley.ensureIndex({"team_id" : 1, "name" : 1, "captain" : 1});
}

function closeDatabase(){
	db.close();
	console.log('db cloesd!');
}

exports.dropCollection = dropCollection;
exports.insertData = insertData;
exports.ensureIndex = ensureIndex;
exports.closeDatabase = closeDatabase;

ensureIndex();