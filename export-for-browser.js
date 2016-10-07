"use strict";

var Datastore = require('nedb');
var async = require('async');
var fs = require('fs');
var _ = require('underscore');

var dbMatches = new Datastore({
    filename: 'matches.nedb',
    autoload: true
});

var dbPitches = new Datastore({
    filename: 'pitches.nedb',
    autoload: true
});

var out = [],
    outJson;

dbMatches.find({}, (err, matches) => {
    async.eachSeries(matches, (match, cb) => {
	dbPitches.findOne({ id: match.relationships.pitch.data.id }, (err, pitch) => {
	    var retMatch = {
		'start_time': match.attributes.start_time,
		'end_time': match.attributes.end_time,
		'home_points': match.attributes.home_points,
		'away_points': match.attributes.away_points,
		'name': match.attributes.name,
		'pitch': pitch.attributes.abbreviation
	    };

	    out.push(retMatch);
	    cb();
	});
    }, (err) => {
	outJson = 'var data = ' + JSON.stringify(out);
	fs.writeFile('data.json', outJson, 'utf8');
    });
});
