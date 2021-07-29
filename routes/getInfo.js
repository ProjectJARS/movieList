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

const mongoose = require('mongoose');


router.get("/movie", async function (req, res) {
	let searchId = req.query.searchId;
	let searchType = (req.query.type).toLowerCase();
	if (searchType === "movie" && await checkContent.isSearchIdValid(searchId, searchType)) {
		let [movieDetailsInfo, trailerInfo, castAndCrewInfo, similarMoviesInfo,] = await getMovieOrTvDetails.getAll(searchId, searchType);
		//res.send(movieDetailsInfo);
		//res.send(trailerInfo);
		//res.send(castAndCrewInfo);
		//res.send(similarMoviesInfo);
		console.log('PARAMS:')
		console.log(movieDetailsInfo.id);
		res.render("details", {
			details: movieDetailsInfo,
			date: movieDetailsInfo.release_date,
			trailer: "https://www.youtube.com/embed/" + trailerInfo.key,
			castAndCrewInfo: castAndCrewInfo,
			similar: similarMoviesInfo,
			type: 'movie',
			backdrop_path: 'https://image.tmdb.org/t/p/original/' + movieDetailsInfo.backdrop_path,

		});
	}
	else {
		res.send("Invalid search for movie");
	}
});

router.get("/tv", async function (req, res) {
	let searchId = req.query.searchId;
	let searchType = (req.query.type).toLowerCase();
	console.log("You searched for a TV show");
	if (searchType === "tv" && await checkContent.isSearchIdValid(searchId, searchType)) {
		let [tvShowDetailsInfo, trailerInfo, castAndCrewInfo, similarTvShowInfo,] = await getMovieOrTvDetails.getAll(searchId, searchType);
		//res.send(similarTvShowInfo);
		//res.redirect("https://google.com")
		res.render("details", {
			details: tvShowDetailsInfo,
			date: tvShowDetailsInfo.first_air_date,
			trailer: "https://www.youtube.com/embed/" + trailerInfo.key,
			castAndCrewInfo: castAndCrewInfo,
			similar: similarTvShowInfo,
			type: 'tv',
			backdrop_path: 'https://image.tmdb.org/t/p/original/' + tvShowDetailsInfo.backdrop_path
		});
	}
	else {
		res.send("Invalid search for TV show ");
	}
});



module.exports = router;


