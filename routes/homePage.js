const express = require('express');
const homeController = require('../controllers/home.controller');
const dataCached = require('../middleware/redis.middleware')
const router = express.Router();



//router.route('/home').get((req, res, next) => { console.log("home"); next() }, homeController.getHome);
router.route('/home').get(dataCached.trendingContent, homeController.getHome);

module.exports = router;