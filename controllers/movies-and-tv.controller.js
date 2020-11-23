const movieAndTvUtils = require('../utils/movie-and-tv.utils');

exports.getInfo = (req, res) => {
  try {
    const { id: searchId } = req.params;
    const searchType = req.baseUrl.slice(1);
    const params = req.originalUrl.slice(req.originalUrl.indexof('?') + 1);

    const info = movieAndTvUtils.getDetails({ searchId, searchType, params });
    req.status(200).json({ status: 'success', data: info });
  } catch (error) {
    res.status(400).text('Bad Request');
  }
};

exports.getSimilar = async (req, res) => {
  try {
    const { id: searchId } = req.params;
    const searchType = req.baseUrl.slice(1);

    const response = await movieAndTvUtils.createRequest({
      searchId,
      searchType,
      requestFor: '/similar',
    });

    const data = response.results.map((result) =>
      movieAndTvUtils.getDetailsResponseObject(result)
    );

    res.status(200).json({ status: 'success', data });
  } catch (error) {
    res.status(400).text('Bad Request');
  }
};
