const mongoose = require('mongoose');

const Anagram = mongoose.model('Anagrams');

// Takes two words and compares them to determine
// if the words are anagrams of each other
function compareWords(input, word) {
  if (input.length < word.length) {
    return false;
  }
  for (let i = 0; i < word.length; i++) {
    if (input[0] === word[i] && input.length === 1) {
      return true;
    } else if (input[0] === word[i]) {
      const nextInput = input.slice(1);
      const nextWord = word.slice(0, i) + word.slice(i + 1);
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
exports.addWords = (req, res) => {
  function onInsert(err, docs) {
    if (err) {
      res.send(err);
      res.end();
    }
  }

  const entry = req.body.entry;
  if (
    entry.length > 12 &&
    entry.charAt(entry.length - 1) === "'" &&
    entry.charAt(0) === "'"
  ) {
    const entryString = entry.replace(/'/g, '');
    const matches = entryString.match(/"/g).length;
    if (matches % 2 == 0) {
      const entryEval = JSON.stringify(eval(`(${entryString})`));
      const entryJSON = JSON.parse(entryEval);
      const words = entryJSON.words;
      if (words) {
        words.forEach((word, index) => {
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
exports.deleteAllWords = (req, res) => {
  Anagram.remove({}, (err) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.sendStatus(204);
    }
  });
};

// Route to delete specific words
exports.deleteWord = (req, res) => {
  const entry = req.params.word;
  if (entry.match(/^[a-zA-Z]+$/)) {
    Anagram.remove(
      {
        entry: req.params.word,
      },
      (err) => {
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
exports.getAnagrams = (req, res) => {
  const limit = req.query.limit;
  const input = req.params.word;
  if (input.match(/^[a-zA-Z]+$/)) {
    let counter = 0;
    const anagrams = [];
    Anagram.find({}, { _id: 0, __v: 0 }, (err, entry) => {
      if (err) {
        res.send(err);
      } else {
        entry.forEach((word) => {
          const individualEntry = word.entry;
          if (
            compareWords(input, individualEntry) &&
          individualEntry !== input &&
          anagrams.indexOf(individualEntry) === -1
          ) {
            if (!limit || counter < limit) {
              anagrams.push(individualEntry);
              counter++;
            }
          }
        });
        const sortedAnagrams = anagrams.sort();
        res.json(`HTTP/1.1 ${res.statusCode} OK {anagrams: [${sortedAnagrams}]}`);
      }
    });
  } else {
    res.status(400).send('Incorrect format, please try again');
  }
};

// Route to get all words
exports.getWords = (req, res) => {
  Anagram.find({}, { _id: 0, __v: 0 }, (err, anagram) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.json(anagram);
    }
  });
};
