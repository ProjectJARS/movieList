const express = require('express');
const DiscoverController = require('../controllers/helper/discover.controller');

const movieAndTvController = require('../controllers/movies-and-tv.controller');

const router = express.Router();

// const client = redis.createClient({
//     port: process.env.REDIS_PORT,
//     host: process.env.REDIS_HOST,
//     password: process.env.REDIS_PASSWORD
// });

// function cache(req, res, next) {
//     client.get("discoverTVorMovieString", (err, data) => {
//         if (err) throw err;
//         if (data != null) {
//             res.send(data);
//         }
//         else {
//             next();
//         }
//     })
// }

router.route('/discover').get(DiscoverController.discover);

//example req: /movie/32?{params will go here}
router.route('/:id').get(movieAndTvController.getInfo);
router.route('/similar').get(movieAndTvController.getSimilar);

module.exports = router;
