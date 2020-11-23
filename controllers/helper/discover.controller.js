const checkContent = require('./check-content.controller');
const movieAndTvUtils = require('../../utils/movie-and-tv.utils');

module.exports.discover = (req, res) => {
  const {
    sort_by = 'popularity.desc',
    page = '1',
    year = '2020',
    language = 'en',
    genre = '',
    searchActorId = '',
  } = req.query;

  // let sort_by = "&sort_by=" + (req.query.sort_by || "popularity.desc");
  // let page = "&page=" + (req.query.page || "1");
  // let year = "&year=" + (req.query.year || "2020");
  // let language = "&language=" + (req.query.language || "en");    //Keep a list
  // let genre = "&genre=" + (req.query.genre || ""); //genre ID - Best would be store the values in DB
  // let searchActorId = "&with_cast=" + (req.query.searchActorId || "");//need to use API

  let params = `&sort_by=${sort_by}&page=${page}&year=${year}&language=${language}&genre=${genre}&with_cast=${searchActorId}`;
  const isTvIdValid = await checkContent.isSearchIdValid({
    movieId: 'tv',
    searchType: 'discover',
    params,
  });
  const isMovieIdValid = await checkContent.isSearchIdValid({
    movieId: 'movie',
    searchType: 'discover',
    params,
  });
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

    // discoverTVorMovieString = JSON.stringify(discoverTVorMovie);
    // client.setex("discoverTVorMovieString", 3600, discoverTVorMovieString);
    res.status(200).json({ satuts: 'success', data: discoverTVorMovie });
  } else {
    res.status(400).text({ status: 'failed', message: 'Bad Request' });
  }
};
