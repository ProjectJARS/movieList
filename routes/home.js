const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
var router = express.Router();
const redis = require("redis");
const getMovieOrTvDetails = require("../models/getMovieOrTvDetails.js");
const checkContent = require("../models/checkValidity.js")





const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set('view engine', 'ejs');

//Middleware
const client = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
});

function cacheForTrending(req, res, next) {
    client.get("trendingContentString", (err, data) => {
        if (err) throw err;
        if (data != null) {
            res.send(data);
        }
        else {
            next();
        }
    })
}

function cacheForDiscover(req, res, next) {
    client.get("discoverTVorMovieString", (err, data) => {
        if (err) throw err;
        if (data != null) {
            res.send(JSON.parse(data));
        }
        else {
            next();
        }
    })
}



router.get("/home", cacheForTrending, async function (req, res) {

    let trendingContent = await getMovieOrTvDetails.getDetails("week", "trending/all");
    let trendingContentString = JSON.stringify(trendingContent);
    client.setex("trendingContentString", 3600, trendingContentString);
    res.send(trendingContent);

    //also create a banner to encourage user to discover
});

router.get("/home/discover", cacheForDiscover, async function (req, res) {

    let sort_by = "&sort_by=" + (req.query.sort_by || "popularity.desc");
    let page = "&page=" + (req.query.page || "1");
    let year = "&year=" + (req.query.year || "2020");
    let language = "&language=" + (req.query.language || "en");    //Keep a list
    let genre = "&genre=" + (req.query.genre || ""); //genre ID -Best would be store the values in DB
    let searchActorId = "&with_cast=" + (req.query.searchActorId || "");; //need to use API

    let params = sort_by + page + year + language + genre + searchActorId;
    if (await checkContent.isSearchIdValid("tv", "discover", params) && await checkContent.isSearchIdValid("movie", "discover", params)) {
        let discoverTV = await getMovieOrTvDetails.getDetails("tv", "discover", params);
        let discoverMovie = await getMovieOrTvDetails.getDetails("movie", "discover", params);

        let discoverTVorMovie = {
            discoverMovie: discoverMovie,
            discoverTV: discoverTV
        }
        discoverTVorMovieString = JSON.stringify(discoverTVorMovie);
        client.setex("discoverTVorMovieString", 3600, discoverTVorMovieString);
        res.send(discoverTVorMovie.discoverTV);
    }
    else {
        res.send("Something went wrong");
    }
});

module.exports = router;