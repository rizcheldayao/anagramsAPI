'use strict';

module.exports = function (app) {
  var controller = require('../controllers/anagramsController');

  // Routes
  app.route('/words.json').post(controller.addWords).delete(controller.deleteAllWords).get(controller.getWords);

  app.route('/words/:word.json').delete(controller.deleteWord);

  app.route('/anagrams/:word.json/:limit?').get(controller.getAnagrams);
};