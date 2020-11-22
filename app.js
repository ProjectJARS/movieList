const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
require('dotenv').config();

//var movie = require("./routes/movie");
/*var trialHomePage = require("./routes/trialHomePage");
app.use("/",trialHomePage);*/

app.get('/', require('./routes/trialHomePage'));
app.get('/movie', require('./routes/getInfo'));
app.get('/tv', require('./routes/getInfo'));
app.get('/search', require('./routes/searchMovie'));
app.get('/home', require('./routes/homePage')); //cache enabled
app.get('/discover', require('./routes/discover')); //cache enabled

module.exports = app;
