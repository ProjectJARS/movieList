const express = require('express');
const { discover } = require('../controllers/helper/discover.controller');

const movieAndTvController = require('../controllers/movies-and-tv.controller');

const router = express.Router();

router.route('/discover').get(discover);

//example req: /movie/32?{params will go here}
router.route('/:id').get(movieAndTvController.getInfo);
router.route('/similar').get(movieAndTvController.getSimilar);

module.exports = router;