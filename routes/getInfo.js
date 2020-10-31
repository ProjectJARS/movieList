const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
var router = express.Router();
const getMovieOrTvDetails = require("../models/getMovieOrTvDetails.js");
const checkContent = require("../models/checkValidity.js")

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set('view engine', 'ejs');

router.get("/movie", async function (req, res) {
	let searchId = req.query.searchId;
	let searchType = (req.query.type).toLocaleLowerCase();
	if (searchType === "movie" && await checkContent.isSearchIdValid(searchId, searchType)) {
		let [movieDetailsInfo, trailerInfo, castAndCrewInfo, similarMoviesInfo,] = await getMovieOrTvDetails.getAll(searchId, searchType);
		res.send(movieDetailsInfo);
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
		res.send(tvShowDetailsInfo);
	}
	else {
		res.send("Invalid search for TV show ");
	}
});

module.exports = router;

/*let movieDetailsInfo = await getMovieOrTvDetails.getDetails(searchId, searchType);
		let trailerInfo = await getMovieOrTvDetails.getTrailer(searchId, searchType);
		let castAndCrewInfo = await getMovieOrTvDetails.getCastAndCrew(searchId, searchType);
		let similarMoviesInfo = await getMovieOrTvDetails.getSimilarMovie(searchId, searchType);
		res.send(movieDetailsInfo);*/
