const checkContent = require('./check-content.controller');

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
  const isTvIdValid = await checkContent.isSearchIdValid({movieId:"tv", searchType:"discover", params});
  const isMovieIdValid = await checkContent.isSearchIdValid({movieId:"movie", searchType:"discover", params});
  if ( isTvIdValid&&isMovieIdValid ) {
      let discoverTV = await 
  
  //     let discoverTV = await getMovieOrTvDetails.getDetails("tv", "discover", params);
  //     let discoverMovie = await getMovieOrTvDetails.getDetails("movie", "discover", params);

  //     let discoverTVorMovie = {
  //         discoverMovie: discoverMovie,
  //         discoverTV: discoverTV
  //     }
  //     discoverTVorMovieString = JSON.stringify(discoverTVorMovie);
  //     client.setex("discoverTVorMovieString", 3600, discoverTVorMovieString);
  //     res.send(discoverTVorMovie.discoverTV);
  // }
  // else {
  //     res.send("Something went wrong");
  // }
};

exports.getMovieDetails()