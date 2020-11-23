const express = require('express');
const { discover } = require('../controllers/helper/discover.controller');

const router = express.Router();

router.route('/').get(discover);