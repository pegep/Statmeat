"use strict";

var Datastore = require('nedb');
var async = require('async');
var fs = require('fs');
var _ = require('underscore');

var data = require('./sample-2016-10-11.json');

var dbs = {};
var sections = ['matches', 'pitches', 'groups', 'teams', 'competition_categories'];

sections.forEach((item) => {
    dbs[item] = new Datastore({
	filename: item + '.nedb',
	autoload: true
    });
});

dbs['competition_categories'].find({}, (err, docs) => {
//    console.log(docs);
});

new Promise((resolve, rejecct) => {
    dbs['matches'].find({}, (err, matches) => {
	resolve(matches);
    });
}).then((matches) => {
    async.eachSeries(matches, (match, cb) => {
	var homeTeamP = new Promise((resolve, reject) => {
	    dbs['teams'].findOne({ id: match.relationships.home_team.data.id }, (err, team) => {
		resolve(team);
	    });
	});
	var awayTeamP = new Promise((resolve, reject) => {
	    dbs['teams'].findOne({ id: match.relationships.away_team.data.id }, (err, team) => {
		resolve(team);
	    });
	});
	var pitchesP = new Promise((resolve, reject) => {
	    dbs['pitches'].findOne({ id: match.relationships.pitch.data.id }, (err, pitch) => {
		resolve(pitch);
	    });
	});

	Promise.all([homeTeamP, awayTeamP, pitchesP])
	    .then((result) => {
		var homeTeam = result[0];
		var awayTeam = result[1];
		var pitch = result[2];
		cb();
	    });
    });
});

