'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Schema for dictionary
var anagramsSchema = new Schema({
  entry: String,
  versionKey: false
});

module.exports = mongoose.model('Anagrams', anagramsSchema);