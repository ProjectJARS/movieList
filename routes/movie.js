const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
var router = express.Router();
const getMovie = require("../models/getMovie.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set('view engine', 'ejs');

router.get("/movie", async function (req, res) {
	var movieId = "335984";
	let movieDetailsInfo = await getMovie.getDetails(movieId);
	let trailerInfo = await getMovie.getTrailer(movieId);
	let castAndCrewInfo = await getMovie.getCastAndCrew(movieId);
	let similarMoviesInfo = await getMovie.getSimilarMovie(movieId);
	res.send(similarMoviesInfo);
});

module.exports = router;
