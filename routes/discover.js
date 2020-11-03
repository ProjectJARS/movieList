const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const redis = require("redis");



var router = express.Router();
const checkContent = require("../models/checkValidity.js")
const getMovieOrTvDetails = require("../models/getMovieOrTvDetails.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set('view engine', 'ejs');
//const REDIS_PORT = process.env.PORT || 6379;


//Middleware
const client = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
});
function cache(req, res, next) {
    client.get("discoverTVorMovieString", (err, data) => {
        if (err) throw err;
        if (data != null) {
            res.send(data);
        }
        else {
            next();
        }
    })
}


router.get("/discover", cache, async function (req, res) {

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

/*client.flushdb( function (err, succeeded) {
    console.log(succeeded); // will be true if successfull
});
*/