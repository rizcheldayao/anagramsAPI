const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Anagram = require('./api/models/anagramsModel');
const routes = require('./api/routes/anagramsRoutes');

const app = express();
const port = process.env.PORT || 3000;

//  Connect to mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/AnagramsDB');

app.use(express.static(path.join(__dirname, '/src')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);
app.listen(port);

console.log(`Server running at port: ${port}`);

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/views/index.html`));
});

app.get('/css', (req, res) => {
  res.sendFile(`${__dirname}/styles/css/style.css`);
});

app.get('/js', (req, res) => {
  res.sendFile(`${__dirname}/js/index.js`);
});

app.use((req, res) => {
  res.status(404).send({ url: `${req.originalUrl} not found` });
});
