const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  API_KEY: process.env.MOVIE_DB_API_KEY,
  BASE_MOVIE_API_URL: process.env.MOVIE_DB_API_URL,
  URL_API_KEY_PARAM: `api_key=${process.env.MOVIE_DB_API_KEY}`,
};
