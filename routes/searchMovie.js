const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const { default: axios } = require("axios");
var router = express.Router();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set('view engine', 'ejs');

router.get("/search", function (req, res) {
    console.log(req.query.searchValue)
    axios.get("https://api.themoviedb.org/3/search/multi?api_key=3ec9740abee42bd9588cded5d225f56e&language=en-US&query=" + req.query.searchValue + "&page=1&include_adult=false").then((returnResult) => {
        console.log(returnResult.data.results);
        let listMovie = returnResult.data.results.filter(item => item.media_type == 'movie')
        let listTV = returnResult.data.results.filter(item => item.media_type == 'tv')

        listMovie = listMovie.map(item => item = { ...item, "poster_path": item.backdrop_path = "https://image.tmdb.org/t/p/w500/" + item.poster_path })

        listTV = listTV.map(item => item = { ...item, "poster_path": item.backdrop_path = "https://image.tmdb.org/t/p/w500/" + item.poster_path })

        let discoverTVorMovie = {
            discoverMovie: listMovie,
            discoverTV: listTV
        }
        discoverTVorMovieString = JSON.stringify(discoverTVorMovie);
        //client.setex("discoverTVorMovieString", 3600, discoverTVorMovieString);
        //res.send(discoverTVorMovie);
        res.render('D:/college/7th sem/project/mvc_arch_nodejs/views/movieWebsite/index', {
            discoverTVorMovie: discoverTVorMovie,
            title: 'Search Results',
            addRemove: false,
        });
    })

});


function authenticateToken(req, res, next) {
    // console.log('in authToken')
    // console.log(req.headers['authorization']);
    console.log(req.headers.cookie)

    const jwtCookie = req.headers.cookie.split(";").find(c => c.trim().startsWith('access_token='));
    const token = jwtCookie.split('=')[1];

    console.log(token)
    if (token == null) {
        console.log('here')
        return res.status(401).send({ message: 'Forbidden' })
    }
    else {
        try {
            jwt.verify(token, 'secret', (err, data) => {
                if (err) {
                    return res.sendStatus(403)
                }
                next()
            })
        } catch (e) {
            console.log(e)
            res.sendStatus(500)
        }
    }
}

module.exports = router;