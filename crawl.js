"use strict";

var Datastore = require('nedb');
var request = require('request');
var async = require('async');
var fs = require('fs');

var baseUrl = 'https://www.statbeat.com/api/v2/competitions/124464/matches?filter[after@sb]=';
var offsetDateString = new Date('2016-09-01').toISOString();
var endDateString = new Date('2017-06-01').toISOString();
var limit = '&limit=100';
var cont = true;

var dbs = {};
var sections = ['matches', 'pitches', 'groups', 'teams', 'competition_categories'];

sections.forEach((item) => {
    dbs[item] = new Datastore({
	filename: item + '.nedb',
	autoload: true
    });
});

var cont = true;
var itemCount = 0;
async.whilst(
    () => cont && offsetDateString < endDateString,
    (cb) => {
	var currentUrl = baseUrl + offsetDateString + limit;
	process.stdout.write('Requesting: ' + currentUrl);

	request(currentUrl, (err, res, body) => {
	    var data = JSON.parse(body);
	    var itemCountLoop = 0;

	    data.data.forEach(function(item) {
		if (!item.attributes.name) {
		    return;
		}

		var offsetTime = new Date(item.attributes.start_time).getTime() + 1000;
		offsetDateString = new Date(offsetTime).toISOString();

		dbs['matches'].insert(item);

		itemCount++;
		itemCountLoop++;
	    });

	    cont = itemCountLoop != 0;

	    sections.forEach((section) => {
		data.included
		    .filter((item) => item.type == section)
		    .forEach((item) => {
			dbs[section].find({ id: item.id }, (err, docs) => {
			    if (!docs.length) {
				dbs[section].insert(item);
			    }
			});
		    });
	    });

	    console.log(', Added: +' + itemCountLoop + ', total: ' + itemCount)
	    cb();
	});
    },
    (err) => {
	var out = [],
	    outJson;
	
	console.log('Total ' + itemCount + ' items');
	console.log('Done!');
	dbs['matches'].find({}, (err, docs) => {
	    docs.forEach((doc) => {
		out.push(doc);
	    });

	    outJson = 'var data = ' + JSON.stringify(out);
	    fs.writeFile('data.json', outJson, 'utf8');
	});
    }
);
