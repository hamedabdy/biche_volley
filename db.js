#!/usr/bin/env node

var mongojs = require('mongojs'),
    dburl = process.env.MONGOHQ_URL || 'mongodb://localhost/tournements',
	db = mongojs(dburl, ['bicheVolley']);

/*
 * inserting data into database
 */
function saveData(data) {
    db.bicheVolley.save(data, {continueOnError: true}, function(err, docs){
       if(err) console.log('err: ' + err + '\n');
       else console.log(JSON.stringify(docs) + ' -- SAVED SUCCESSFULLY!\n');
   });
}

function dropCollection(){
	db.bicheVolley.drop();
}

function ensureIndex(){
	db.bicheVolley.ensureIndex({"name" : 1, "captain" : 1});
}

function closeDatabase(){
	db.close();
	console.log('db cloesd!');
}

exports.dropCollection = dropCollection;
exports.saveData = saveData;
exports.ensureIndex = ensureIndex;
exports.closeDatabase = closeDatabase;

ensureIndex();