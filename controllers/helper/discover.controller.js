const checkContent = require('./check-content.controller');
const movieAndTvUtils = require('../../utils/movie-and-tv.utils');
const redis = require("redis");

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


module.exports.discover = async (req, res) => {
  console.log("CAlled")
  let sort_by = '&sort_by=' + (req.query.sort_by || 'popularity.desc');
  let page = '&page=' + (req.query.page || '1');
  let year = '&year=' + (req.query.year || '2020');
  let language = '&language=' + (req.query.language || 'en'); //Keep a list
  let genre = req.query.genre ? `&genre=${req.query.genre}` : ''; //genre ID - Best would be store the values in DB
  let searchActorId = req.query.searchActorId
    ? `&with_cast=${req.query.searchActorId}`
    : ''; //need to use API
  let params = sort_by + page + year + language + genre + searchActorId;

  //check if tv discover URL is correct
  const isTvIdValid = await checkContent.isSearchIdValid({
    searchId: 'tv',
    searchType: 'discover',
    params,
  });
  //check if movie discover URL is correct
  const isMovieIdValid = await checkContent.isSearchIdValid({
    searchId: 'movie',
    searchType: 'discover',
    params,
  });
  // if correct get movie details and send 
  if (isTvIdValid && isMovieIdValid) {
    let discoverTV = await movieAndTvUtils.getDetails({
      searchType: 'discover',
      searchId: 'tv',
      params,
    });
    let discoverMovie = await movieAndTvUtils.getDetails({
      searchType: 'discover',
      searchId: 'movie',
      params,
    });

    let discoverTVorMovie = {
      discoverMovie: discoverMovie,
      discoverTV: discoverTV,
    };

    discoverTVorMovieString = JSON.stringify(discoverTVorMovie);
    client.setex("discoverTVorMovieString", 3600, discoverTVorMovieString);

    res.status(200).json({ status: 'success', data: discoverTVorMovie });
  } else {
    res.status(400).json({ status: 'failed', message: 'Bad Request' });
  }
};
