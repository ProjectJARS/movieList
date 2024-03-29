const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const got = require('got');
var router = express.Router();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const api = process.env.MOVIE_API_KEY;
const apiKey = '?api_key=' + api;
const orginalArgumentUrl = process.env.MOVIE_API_URL;

module.exports.getAll = async function (searchId, searchType) {
  let movieDetailsInfo = await getDetails(searchId, searchType);
  let trailerInfo = await getTrailer(searchId, searchType);
  let castAndCrewInfo = await getCastAndCrew(searchId, searchType);
  let similarMoviesInfo = await getSimilarMovie(searchId, searchType);
  return [movieDetailsInfo, trailerInfo, castAndCrewInfo, similarMoviesInfo];
};

module.exports.getDetails = getDetails;
async function getDetails(searchId, searchType, params = '') {
  let argUrl = orginalArgumentUrl + searchType + '/';
  let targetUrl = argUrl + searchId + apiKey + params;
  console.log('Getting details from: ' + targetUrl);
  const responsePromise = got(targetUrl);

  const bufferPromise = responsePromise.buffer();
  const jsonPromise = responsePromise.json();
  const [response, buffer, json] = await Promise.all([
    responsePromise,
    bufferPromise,
    jsonPromise,
  ]);

  let allMovieData = JSON.parse(response.body);
  //console.log("SearchID:" + searchId);
  if (
    searchId === 'day' ||
    searchId === 'week' ||
    searchId === 'movie' ||
    searchId === 'tv'
  ) {
    let movieObjectList = [];
    allMovieData = allMovieData.results;

    for (let index = 0; index < allMovieData.length; index++) {
      const movieData = allMovieData[index];
      movieObjectList.push(getMovieDetails(movieData));
    }
    return movieObjectList;
  } else {
    return getMovieDetails(allMovieData);
  }

  function getMovieDetails(movieData) {
    var movieObject = {
      id: movieData.id,
      original_title: movieData.original_title,
      original_name: movieData.original_name,
      release_date: movieData.release_date,
      first_air_date: movieData.first_air_date,
      original_language: movieData.original_language,
      genres: movieData.genres,
      overview: movieData.overview,
      number_of_seasons: movieData.number_of_seasons,
      poster_path: "https://image.tmdb.org/t/p/w500/" + movieData.poster_path,
      vote_average: movieData.vote_average,
      runTime: movieData.runtime,
      created_by: [
        movieData.created_by
      ],
      media_type: movieData.media_type,
      backdrop_path: movieData.backdrop_path
    };
    return movieObject;
  }
}



module.exports.getTrailer = getTrailer;
async function getTrailer(searchId, searchType) {
  let argUrl = orginalArgumentUrl + searchType + '/';
  let trailerUrl = argUrl + searchId + '/videos' + apiKey;
  console.log('Getting trailer from: ' + trailerUrl);
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
    if (trailerList[trailer].type === 'Trailer') {
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
}

module.exports.getCastAndCrew = getCastAndCrew;
async function getCastAndCrew(searchId, searchType) {
  let argUrl = orginalArgumentUrl + searchType + '/';
  let trailerUrl = argUrl + searchId + '/credits' + apiKey;
  console.log('Getting cast and crew info from: ' + trailerUrl);
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
        'https://image.tmdb.org/t/p/w500/' + castList[i].profile_path,
    };
    console.log(castObject.name)
    allCastMembers.push(castObject);
  }

  const crewList = castAndCrewList.crew;
  for (i in crewList) {
    if (crewList[i].job == 'Creator' || crewList[i].job == 'Producer' || crewList[i].job == 'Director') {
      var crewObject = {
        id: crewList[i].id,
        name: crewList[i].name,
        job: crewList[i].job,
        profile_path:
          'https://image.tmdb.org/t/p/w500/' + crewList[i].profile_path,
      };
      allCrewMembers.push(crewObject);
    }
  }
  let castAndCrewInfo = {
    cast: allCastMembers,
    crew: allCrewMembers,
  };
  return castAndCrewInfo;
}

module.exports.getSimilarMovie = getSimilarMovie;
async function getSimilarMovie(searchId, searchType) {
  let argUrl = orginalArgumentUrl + searchType + '/';
  let trailerUrl = argUrl + searchId + '/similar' + apiKey;
  console.log('Getting Similar Movies/TV show from: ' + trailerUrl);
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
      original_name: similarMovieList[i].original_name,
      poster_path:
        'https://image.tmdb.org/t/p/w500/' + similarMovieList[i].poster_path,
      release_date: similarMovieList[i].release_date,
    };
    similarMovies.push(similarMovieObj);
  }
  return similarMovies;
}

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
