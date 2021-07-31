const express = require('express');
const discoverController = require('../controllers/helper/discover.controller');
const movieAndTvController = require('../controllers/movies-and-tv.controller');
const dataCached = require('../middleware/redis.middleware')

const router = express.Router();


//router.route('/discover').get(discoverController.discover);

// router.get('/discover', function (req, res) {
//     res.send("Working");
// });
router.route('/discover').get(dataCached.discoveredContent, discoverController.discover);

module.exports = router;
