'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var Anagram = require('./api/models/anagramsModel');
var routes = require('./api/routes/anagramsRoutes');

var app = express();
var port = process.env.PORT || 3000;

//  Connect to mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/AnagramsDB');

app.use(express.static(path.join(__dirname, '/src')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);
app.listen(port);

console.log('Server running at port: ' + port);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/css', function (req, res) {
  res.sendFile(__dirname + '/styles/css/style.css');
});

app.get('/js', function (req, res) {
  res.sendFile(__dirname + '/js/index.js');
});

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' });
});