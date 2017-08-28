'use strict';

var mongoose = require('mongoose');

var Anagram = mongoose.model('Anagrams');

// Takes two words and compares them to determine
// if the words are anagrams of each other
function compareWords(input, word) {
  if (input.length < word.length) {
    return false;
  }
  for (var i = 0; i < word.length; i++) {
    if (input[0] === word[i] && input.length === 1) {
      return true;
    } else if (input[0] === word[i]) {
      var nextInput = input.slice(1);
      var nextWord = word.slice(0, i) + word.slice(i + 1);
      if (nextInput.length === 0 && nextWord.length === 0) {
        return true;
      }
      return compareWords(nextInput, nextWord);
    } else if (i === word.length - 1) {
      return false;
    }
  }
  return false;
}

// Route to add words
exports.addWords = function (req, res) {
  function onInsert(err, docs) {
    if (err) {
      res.send(err);
      res.end();
    }
  }

  var entry = req.body.entry;
  if (entry.length > 12 && entry.charAt(entry.length - 1) === "'" && entry.charAt(0) === "'") {
    var entryString = entry.replace(/'/g, '');
    var matches = entryString.match(/"/g).length;
    if (matches % 2 == 0) {
      var entryEval = JSON.stringify(eval('(' + entryString + ')'));
      var entryJSON = JSON.parse(entryEval);
      var words = entryJSON.words;
      if (words) {
        words.forEach(function (word, index) {
          if (word.length > 0) {
            Anagram.collection.insert({ entry: word }, onInsert);
            if (index === words.length - 1) {
              res.status(201).send('HTTP/1.1 201 Created');
            }
          } else {
            res.status(400).send('Empty array, please enter words into array"');
          }
        });
      } else {
        res.status(400).send('Empty array, please enter words into array');
      }
    } else {
      res.status(400).send('Incorrect format, please try again');
    }
  } else {
    res.status(400).send('Incorrect format, please try again');
  }
};

// Route to delete all words
exports.deleteAllWords = function (req, res) {
  Anagram.remove({}, function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.sendStatus(204);
    }
  });
};

// Route to delete specific words
exports.deleteWord = function (req, res) {
  var entry = req.params.word;
  if (entry.match(/^[a-zA-Z]+$/)) {
    Anagram.remove({
      entry: req.params.word
    }, function (err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.sendStatus(204);
      }
    });
  } else {
    res.status(400).send('Incorrect format, please try again');
  }
};

// Route to retrieve anagrams of a word
exports.getAnagrams = function (req, res) {
  var limit = req.query.limit;
  var input = req.params.word;
  if (input.match(/^[a-zA-Z]+$/)) {
    var counter = 0;
    var anagrams = [];
    Anagram.find({}, { _id: 0, __v: 0 }, function (err, entry) {
      if (err) {
        res.send(err);
      } else {
        entry.forEach(function (word) {
          var individualEntry = word.entry;
          if (compareWords(input, individualEntry) && individualEntry !== input && anagrams.indexOf(individualEntry) === -1) {
            if (!limit || counter < limit) {
              anagrams.push(individualEntry);
              counter++;
            }
          }
        });
        var sortedAnagrams = anagrams.sort();
        res.json('HTTP/1.1 ' + res.statusCode + ' OK {anagrams: [' + sortedAnagrams + ']}');
      }
    });
  } else {
    res.status(400).send('Incorrect format, please try again');
  }
};

// Route to get all words
exports.getWords = function (req, res) {
  Anagram.find({}, { _id: 0, __v: 0 }, function (err, anagram) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.json(anagram);
    }
  });
};