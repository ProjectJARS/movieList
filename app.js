const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const movieAndTvRouter = require('./routes/movies.routes');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
require('dotenv').config();

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use('/movie', movieAndTvRouter);
app.use('/tv', movieAndTvRouter);

//var movie = require("./routes/movie");
/*var trialHomePage = require("./routes/trialHomePage");
app.use("/",trialHomePage);*/

app.get('/', require('./routes/trialHomePage'));
// app.get('/movie', require('./routes/getInfo'));
// app.get('/tv', require('./routes/getInfo'));
// app.get('/search', require('./routes/searchMovie'));
// app.get('/home', require('./routes/homePage')); //cache enabled
// app.get('/discover', require('./routes/discover')); //cache enabled

module.exports = app;
