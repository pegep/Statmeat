"use strict";

var Datastore = require('nedb');
var request = require('request');
var async = require('async');
var fs = require('fs');

var baseUrl = 'https://www.statbeat.com/api/v2/competitions/124464/matches?filter[after@sb]=';
var offsetDateString = new Date('2016-10-06').toISOString();
var endDateString = new Date('2017-06-01').toISOString();
var limit = '&limit=100';
var cont = true;

var db = new Datastore({
    filename: 'statmeat.nedb',
    autoload: true
});

var cont = true;
var itemCount = 0;
async.whilst(
    () => cont && offsetDateString < endDateString,
    (cb) => {
	var currentUrl = baseUrl + offsetDateString + limit;
	console.log('Requesting: ' + currentUrl);

	request(currentUrl, (err, res, body) => {
	    var data = JSON.parse(body);
	    var itemCountLoop = 0;

	    data.data.forEach(function(item) {
		if (!item.attributes.name) {
		    return;
		}

		var offsetTime = new Date(item.attributes.start_time).getTime() + 1000;

		offsetDateString = new Date(offsetTime).toISOString();

		console.log(offsetDateString + ', ' + item.attributes.name);

		db.insert(item);

		itemCount++;
		itemCountLoop++;
	    });

	    if (itemCountLoop == 0) {
		cont = false;
	    }

	    console.log('Added: +' + itemCountLoop + ', total: ' + itemCount)
	    cb();
	});
    },
    (err) => {
	var out = [],
	    outJson;
	
	console.log('Total ' + itemCount + ' items');
	console.log('Done!');
	db.find({}, (err, docs) => {
	    docs.forEach((doc) => {
		out.push(doc);
	    });

	    outJson = 'var data = ' + JSON.stringify(out);
	    fs.writeFile('data.json', outJson, 'utf8');
	});
    }
);

/*
db.find({
    'attributes.name': /talous/i
}, (err, docs) => {
    console.log(docs);
});

var obj = {
    "attributes": {
	"away_points": null,
	"away_rating_delta": 0,
	"description": "",
	"end_time": "2016-10-03T18:55:00.000000Z",
	"home_points": null,
	"home_rating_delta": 0,
	"live_away_points": 0,
	"live_home_points": 0,
	"name": "SalaJengi66 - Team K",
	"start_time": "2016-10-03T18:00:00.000000Z",
	"timezone_offset": 3,
	"title": "Group A"
    },
    "id": "162684",
    "relationships": {},
    "type": "matches"
};

var dataMock = [ { attributes:
		   { away_points: 3,
		     away_rating_delta: -94,
		     description: '',
		     end_time: '2016-10-03T14:55:00.000000Z',
		     home_points: 7,
		     home_rating_delta: 94,
		     live_away_points: null,
		     live_home_points: null,
		     name: 'Tolppakuti - Kyrönmaan Pallo',
		     start_time: '2016-10-03T14:00:00.000000Z',
		     timezone_offset: 3,
		     title: 'Lohko A' },
		   id: '163542',
		   relationships:
		   { away_team: [Object],
		     category: [Object],
		     group: [Object],
		     home_team: [Object],
		     pitch: [Object] },
		   type: 'matches' },
		 { attributes:
		   { away_points: 4,
		     away_rating_delta: 30,
		     description: '',
		     end_time: '2016-10-03T15:55:00.000000Z',
		     home_points: 2,
		     home_rating_delta: -30,
		     live_away_points: null,
		     live_home_points: null,
		     name: 'Talous+Procountor - Efecte',
		     start_time: '2016-10-03T15:00:00.000000Z',
		     timezone_offset: 3,
		     title: 'Lohko A' },
		   id: '164067',
		   relationships:
		   { away_team: [Object],
		     category: [Object],
		     group: [Object],
		     home_team: [Object],
		     pitch: [Object] },
		   type: 'matches' },
		 { attributes:
		   { away_points: 4,
		     away_rating_delta: 150,
		     description: '',
		     end_time: '2016-10-03T16:25:00.000000Z',
		     home_points: 1,
		     home_rating_delta: -150,
		     live_away_points: null,
		     live_home_points: null,
		     name: 'SBS Kings - Tuplahuti Naiset',
		     start_time: '2016-10-03T15:30:00.000000Z',
		     timezone_offset: 3,
		     title: 'Lohko A' },
		   id: '162451',
		   relationships:
		   { away_team: [Object],
		     category: [Object],
		     group: [Object],
		     home_team: [Object],
		     pitch: [Object] },
		   type: 'matches' } ];
*/
