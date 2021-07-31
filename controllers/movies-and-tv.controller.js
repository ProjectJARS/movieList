const movieAndTvUtils = require('../utils/movie-and-tv.utils');

exports.getInfo = async (req, res) => {
  try {
    const { id: searchId, } = req.params;
    const searchType = req.baseUrl.slice(1);
    let params = '';
    if (req.originalUrl.includes('?')) {
      params = req.originalUrl.slice(req.originalUrl.indexOf('?') + 1);
    }
    console.log(searchId, searchType)
    const info = await movieAndTvUtils.getDetails({
      searchId,
      searchType,
      params,
    });
    res.status(200).json({ status: 'success', data: info });
  } catch (error) {
    res.send(error);
  }
};

//gets Similar movie or TV
exports.getSimilar = async (req, res) => {
  try {
    const { id: searchId } = req.params;
    const searchType = req.baseUrl.slice(1);
    //create request for TMDB API
    const response = await movieAndTvUtils.createRequest({
      searchId,
      searchType,
      requestFor: '/similar',
    });
    //return required list of object data
    const data = JSON.parse(response.body)
    // const data = response.results.map((result) =>
    //   movieAndTvUtils.getDetailsResponseObject(result)
    // );

    res.status(200).json({ status: 'success', data });
  } catch (error) {
    console.log(error);
    res.status(400).send('Bad Request');
  }
};
