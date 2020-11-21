const express = require('express');

const { discover } = require('../controllers/movies.controller');

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

router.route('/discover').get(discover);
