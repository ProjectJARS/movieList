const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
var router = express.Router();
const getMovie = require("../models/getMovie.js");
const checkMovie = require("../models/movieValidity.js")

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set('view engine', 'ejs');

router.get("/movie", async function (req, res) {
	console.log("Id: " + req.query.movieId)
	var movieId = req.query.movieId;
	if (await checkMovie.isMovieValid(movieId)) {
		let movieDetailsInfo = await getMovie.getDetails(movieId);
		let trailerInfo = await getMovie.getTrailer(movieId);
		let castAndCrewInfo = await getMovie.getCastAndCrew(movieId);
		let similarMoviesInfo = await getMovie.getSimilarMovie(movieId);
		res.send(movieDetailsInfo);
	}
	else {
		res.send("Invalid");
	}
});

module.exports = router;
