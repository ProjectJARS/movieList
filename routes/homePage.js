<<<<<<< HEAD
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
var router = express.Router();
const getMovieOrTvDetails = require("../models/getMovieOrTvDetails.js");
const checkContent = require("../models/checkValidity.js")
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set('view engine', 'ejs');
router.get("/trending", async function (req, res) {
    let trendingContent = await getMovieOrTvDetails.getDetails("week", "trending/all");
    let trendingContentString = JSON.stringify(trendingContent);
    const moviedata = trendingContent.filter(item => item.media_type == 'movie')
    const tvdata = trendingContent.filter(item => item.media_type == 'tv')
    const discoverTVorMovie = {
        discoverMovie: moviedata,
        discoverTV: tvdata
    }
    res.render('D:/college/7th sem/project/mvc_arch_nodejs/views/movieWebsite/index', {
        discoverTVorMovie: discoverTVorMovie,
        title: 'Trending',
        addRemove: false
    });
});
=======
const express = require('express');
const homeController = require('../controllers/home.controller');
const dataCached = require('../middleware/redis.middleware')
const router = express.Router();



//router.route('/home').get((req, res, next) => { console.log("home"); next() }, homeController.getHome);
router.route('/home').get(dataCached.trendingContent, homeController.getHome);

>>>>>>> 1d6ebb29c2a69c2c10690b46dc83360b7e719ed3
module.exports = router;