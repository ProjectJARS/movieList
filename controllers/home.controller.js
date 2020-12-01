const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const redis = require("redis");
var router = express.Router();
const checkContent = require('./helper/check-content.controller');
const movieAndTvUtils = require('../utils/movie-and-tv.utils');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set('view engine', 'ejs');

const client = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
});

module.exports.getHome = async (req, res) => {
    const searchId = 'week'
    const searchType = 'trending/all'
    let trendingContent = await movieAndTvUtils.getDetails({ searchId, searchType });
    let trendingContentString = JSON.stringify(trendingContent);
    client.setex("trendingContentString", 3600, trendingContentString);
    res.send(trendingContent);

    //also create a banner to encourage user to discover
};