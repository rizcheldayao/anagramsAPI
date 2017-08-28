const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Schema for dictionary
const anagramsSchema = new Schema({
  entry: String,
  versionKey: false,
});

module.exports = mongoose.model('Anagrams', anagramsSchema);
