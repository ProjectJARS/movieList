const express = require('express');
const DiscoverController = require('../controllers/helper/discover.controller');

const movieAndTvController = require('../controllers/movies-and-tv.controller');

const router = express.Router();

//router.route('/discover').get(DiscoverController.discover);

//example req: /movie/32?{params will go here}
router.route('/:id').get(movieAndTvController.getInfo);
router.route('/similar/:id').get(movieAndTvController.getSimilar);

module.exports = router;
