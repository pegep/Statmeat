"use strict";

let Datastore = require('nedb');
let async = require('async');
let fs = require('fs');
let _ = require('underscore');

let dbs = {};
let sections = ['matches', 'pitches', 'groups', 'teams', 'competition_categories'];

sections.forEach((item) => {
    dbs[item] = new Datastore({
	filename: item + '.nedb',
	autoload: true
    });
});

let out = [],
    outJson;

new Promise((resolve, rejecct) => {
    dbs['matches'].find({}, (err, matches) => {
	resolve(matches);
    });
}).then((matches) => {
    async.eachSeries(matches, (match, cb) => {
	let homeTeamP = new Promise((resolve, reject) => {
	    dbs['teams'].findOne({ id: match.relationships.home_team.data.id }, (err, team) => {
		resolve(team);
	    });
	});
	let awayTeamP = new Promise((resolve, reject) => {
	    dbs['teams'].findOne({ id: match.relationships.away_team.data.id }, (err, team) => {
		resolve(team);
	    });
	});
	let pitchP = new Promise((resolve, reject) => {
	    dbs['pitches'].findOne({ id: match.relationships.pitch.data.id }, (err, pitch) => {
		resolve(pitch);
	    });
	});
	let categoryP = new Promise((resolve, reject) => {
	    dbs['competition_categories'].findOne({ id: match.relationships.category.data.id }, (err, category) => {
		resolve(category);
	    });
	});

	Promise.all([homeTeamP, awayTeamP, pitchP, categoryP])
	    .then((result) => {
		let homeTeam = result[0];
		let awayTeam = result[1];
		let pitch = result[2];
		let category = result[3];

		let retMatch = {
		    'start_time': match.attributes.start_time,
		    'end_time': match.attributes.end_time,
		    'home_points': match.attributes.home_points,
		    'away_points': match.attributes.away_points,
		    'name': match.attributes.name,
		    'pitch_abbreviation': pitch.attributes.abbreviation,
		    'category_name': category.attributes.name,
		    'category_slug': category.attributes.slug,
		    'home_team_name': homeTeam.attributes.name,
		    'home_team_picture_small': homeTeam.attributes.picture.small,
		    'home_team_hometown': homeTeam.attributes.hometown,
		    'away_team_name': awayTeam.attributes.name,
		    'away_team_picture_small': awayTeam.attributes.picture.small,
		    'away_team_hometown': awayTeam.attributes.hometown,
		};

		out.push(retMatch);

		cb();
	    });
    }, (err) => {
	outJson = 'var data = ' + JSON.stringify(out);
	fs.writeFile('data.json', outJson, 'utf8');
    });
});
