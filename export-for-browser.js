"use strict";

var Datastore = require('nedb');
var async = require('async');
var fs = require('fs');
var _ = require('underscore');

var dbs = {};
var sections = ['matches', 'pitches', 'groups', 'teams', 'competition_categories'];

sections.forEach((item) => {
    dbs[item] = new Datastore({
	filename: item + '.nedb',
	autoload: true
    });
});

var out = [],
    outJson;

dbs['matches'].find({}, (err, matches) => {
    async.eachSeries(matches, (match, cb) => {
	dbs['pitches'].findOne({ id: match.relationships.pitch.data.id }, (err, pitch) => {
	    async.parallel([
		(cb) => {
		    dbs['teams'].findOne({ id: match.relationships.home_team.data.id }, (err, team) => { cb(null, team); });
		},
		(cb) => {
		    dbs['teams'].findOne({ id: match.relationships.away_team.data.id }, (err, team) => { cb(null, team); });
		}
	    ], (err, teams) => {
		let homeTeam = teams[0];
		let awayTeam = teams[1];

		var retMatch = {
		    'start_time': match.attributes.start_time,
		    'end_time': match.attributes.end_time,
		    'home_points': match.attributes.home_points,
		    'away_points': match.attributes.away_points,
		    'pitch': pitch.attributes.abbreviation,
		    'home_team': homeTeam,
		    'away_team': awayTeam
		};

		out.push(retMatch);
		cb();
	    });
	});
    }, (err) => {
	outJson = 'var data = ' + JSON.stringify(out);
	fs.writeFile('data.json', outJson, 'utf8');
    });
});
