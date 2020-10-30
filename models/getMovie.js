const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const got = require("got");
var router = express.Router();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const api = process.env.MOVIE_API_KEY;
const apiKey = "?api_key=" + api;
const argUrl = "https://api.themoviedb.org/3/movie/";

module.exports.getDetails = async function (movieId) {
  let targetUrl = argUrl + movieId + apiKey;
  const responsePromise = got(targetUrl);
  const bufferPromise = responsePromise.buffer();
  const jsonPromise = responsePromise.json();
  const [response, buffer, json] = await Promise.all([
    responsePromise,
    bufferPromise,
    jsonPromise,
  ]);
  const movieData = JSON.parse(response.body);

  var movieObject = {
    original_title: movieData.original_title,
    release_date: movieData.release_date,
    original_language: movieData.original_language,
    genres: movieData.genres,
    overview: movieData.overview,
    poster_path: "https://image.tmdb.org/t/p/w500/" + movieData.poster_path,
    vote_average: movieData.vote_average,
    runTime: movieData.runtime,
  };
  return movieObject;
};

module.exports.getTrailer = async function (movieId) {
  let trailerUrl = argUrl + movieId + "/videos" + apiKey;
  const responsePromise = got(trailerUrl);
  const bufferPromise = responsePromise.buffer();
  const jsonPromise = responsePromise.json();

  const [response, buffer, json] = await Promise.all([
    responsePromise,
    bufferPromise,
    jsonPromise,
  ]);
  const movieTrailerData = JSON.parse(response.body);
  let trailerList = movieTrailerData.results;
  let trailerIndex = 0;

  for (trailer in trailerList) {
    if (trailerList[trailer].type === "Trailer") {
      break;
    } else {
      trailerIndex = trailerIndex + 1;
      continue;
    }
  }
  var trailerObj = {
    name: trailerList[trailerIndex].name,
    key: trailerList[trailerIndex].key,
  };
  return trailerObj;
};

module.exports.getCastAndCrew = async function (movieId) {
  let trailerUrl = argUrl + movieId + "/credits" + apiKey;
  const responsePromise = got(trailerUrl);
  const bufferPromise = responsePromise.buffer();
  const jsonPromise = responsePromise.json();

  const [response, buffer, json] = await Promise.all([
    responsePromise,
    bufferPromise,
    jsonPromise,
  ]);
  const castAndCrewList = JSON.parse(response.body);
  let castList = castAndCrewList.cast;
  let allCastMembers = [];
  let allCrewMembers = [];
  for (i in castList) {
    var castObject = {
      id: castList[i].id,
      character: castList[i].character,
      name: castList[i].name,
      profile_path:
        "https://image.tmdb.org/t/p/w500/" + castList[i].profile_path,
    };
    allCastMembers.push(castObject);
  }

  const crewList = castAndCrewList.crew;
  for (i in crewList) {
    if (crewList[i].job == "Producer" || crewList[i].job == "Director") {
      var crewObject = {
        id: crewList[i].id,
        name: crewList[i].name,
        job: crewList[i].job,
        profile_path:
          "https://image.tmdb.org/t/p/w500/" + crewList[i].profile_path,
      };
      allCrewMembers.push(crewObject);
    }
  }
  let castAndCrewInfo = {
    cast: allCastMembers,
    crew: allCrewMembers,
  };
  return castAndCrewInfo;
};

module.exports.getSimilarMovie = async function (movieId) {
  let trailerUrl = argUrl + movieId + "/similar" + apiKey;
  const responsePromise = got(trailerUrl);
  const bufferPromise = responsePromise.buffer();
  const jsonPromise = responsePromise.json();
  const [response, buffer, json] = await Promise.all([
    responsePromise,
    bufferPromise,
    jsonPromise,
  ]);
  const similarMovieData = JSON.parse(response.body);
  let similarMovieList = similarMovieData.results;
  var similarMovies = [];
  for (i in similarMovieList) {
    var similarMovieObj = {
      id: similarMovieList[i].id,
      title: similarMovieList[i].title,
      poster_path:
        "https://image.tmdb.org/t/p/w500/" + similarMovieList[i].poster_path,
      release_date: similarMovieList[i].release_date,
    };
    similarMovies.push(similarMovieObj);
  }
  return similarMovies;
};



/*
module.exports.getDetails = async function (apiKey,movieId,targetUrl){
    return new Promise(resolve =>{
        let url = targetUrl + movieId + apiKey;
        let movieDetails = [];
        https.get(url, function(response){
            if(response.statusCode == 200){
                let chunks = [];
                response.on("data",function(data){
                    chunks.push(data);
                }).on('end', function() {
                    let data   = Buffer.concat(chunks);
                    const movieData = JSON.parse(data);
                    var movieObject = {
                        original_title : movieData.original_title,
                        release_date : movieData.release_date,
                        original_language : movieData.original_language,
                        genres : movieData.genres,
                        overview : movieData.overview,
                        poster_path : "https://image.tmdb.org/t/p/w500/" + movieData.poster_path,
                        vote_average : movieData.vote_average,
                        runTime : movieData.runtime,
                    };
                    console.log(movieObject);
                    movieDetails.push(movieObject);
                });
            }
            else{
                console.log("Something went wrong");
            }
            resolve(movieDetails);
        });
    });

};*/
