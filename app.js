const express = require('express');
const bodyParser = require('body-parser');
<<<<<<< HEAD
const jwt = require('jsonwebtoken');
const router = require('./routes/trialHomePage');
=======
const morgan = require('morgan');

const movieAndTvRouter = require('./routes/movies.routes');
const searchRoute = require('./routes/search.routes');
const discoverRoute = require('./routes/discover.routes');
const homeRoute = require('./routes/homePage');
>>>>>>> 1d6ebb29c2a69c2c10690b46dc83360b7e719ed3

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
require('dotenv').config();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}



app.get('/home', homeRoute);
//movie and tv base route
app.use('/movie', movieAndTvRouter);
app.use('/tv', movieAndTvRouter);
app.get('/discover', discoverRoute);

//search base route
app.use('/search', searchRoute);

//var movie = require("./routes/movie");
/*var trialHomePage = require("./routes/trialHomePage");
app.use("/",trialHomePage);*/


app.get('/', require('./routes/trialHomePage'));
<<<<<<< HEAD
app.get('/home', authenticateToken, require('./routes/trialHomePage'));
app.get('/movie', authenticateToken, require('./routes/getInfo'));
app.get('/tv', authenticateToken, require('./routes/getInfo'));
app.get('/search', authenticateToken, require('./routes/searchMovie'));
app.get('/trending', authenticateToken, require('./routes/homePage'));
app.get('/discover', authenticateToken, require('./routes/discover'));

app.get('/login', require('./routes/login'));
app.post('/login', require('./routes/login'));
app.post('/register', require('./routes/register'));
app.get('/register', require('./routes/register'));
app.post('/addMovie', authenticateToken, require('./routes/mymovies'));
app.get('/myMovies', authenticateToken, require('./routes/mymovies'));
app.post('/removeMovie', authenticateToken, require('./routes/mymovies'));
app.get('/getSimilar/:id', authenticateToken, require('./routes/mymovies'));
app.get('/faq', require('./routes/faq'));//
app.get('/team', require('./routes/team'));//


function authenticateToken(req, res, next) {
    // console.log('in authToken')
    // console.log(req.headers['authorization']);
    console.log(req.headers.cookie)
    try {
        const jwtCookie = req.headers.cookie.split(";").find(c => c.trim().startsWith('access_token='));
        const token = jwtCookie.split('=')[1];

        console.log(token)
        if (token == null) {
            console.log('here')
            res.redirect('/');
        }
        else {
            try {
                jwt.verify(token, 'secret', (err, data) => {
                    if (err) {
                        res.redirect('/');
                    }
                    next()
                })
            } catch (e) {
                console.log(e)
                res.redirect('/');

            }
        }
    }
    catch (error) {
        res.redirect('/');
    }
}
=======
// app.get('/movie', require('./routes/getInfo'));
// app.get('/tv', require('./routes/getInfo'));
// app.get('/search', require('./routes/searchMovie'));
// app.get('/home', require('./routes/homePage')); //cache enabled
// app.get('/discover', require('./routes/discover')); //cache enabled
>>>>>>> 1d6ebb29c2a69c2c10690b46dc83360b7e719ed3

module.exports = app;
