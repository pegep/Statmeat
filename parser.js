"use strict";

var Datastore = require('nedb');
var async = require('async');
var fs = require('fs');
var _ = require('underscore');

var data = require('./sample-2016-10-11.json');

var matches = data.data
    .filter((item) => item.type == 'matches')
    .map((item) => ({ [item.id]: item }));

var pitches = data.included
    .filter((item) => item.type == 'pitches')
    .map((item) => ({ [item.id]: item }));

var groups = data.included
    .filter((item) => item.type == 'groups')
    .map((item) => ({ [item.id]: item }));

var teams = data.included
    .filter((item) => item.type == 'groups')
    .map((item) => ({ [item.id]: item }));

var competitionCategories = data.included
    .filter((item) => item.type == 'groups')
    .map((item) => ({ [item.id]: item }));

console.log(matches);