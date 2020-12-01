const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
var router = express.Router();
const getMovieOrTvDetails = require("../models/getMovieOrTvDetails.js");
const checkContent = require("../models/checkValidity.js")
const redis = require("redis");




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
function cache(req, res, next) {
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

router.get("/home", cache, async function (req, res) {

    let trendingContent = await getMovieOrTvDetails.getDetails("week", "trending/all");
    let trendingContentString = JSON.stringify(trendingContent);
    client.setex("trendingContentString", 3600, trendingContentString);
    res.send(trendingContent);

    //also create a banner to encourage user to discover
});

module.exports = router;