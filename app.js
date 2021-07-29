const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const router = require('./routes/trialHomePage');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
require('dotenv').config();

//var movie = require("./routes/movie");
/*var trialHomePage = require("./routes/trialHomePage");
app.use("/",trialHomePage);*/


app.get('/', require('./routes/trialHomePage'));
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

module.exports = app;
