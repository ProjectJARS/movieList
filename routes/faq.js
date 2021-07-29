const express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const date = require("../models/date.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set('view engine', 'ejs');


router.get("/faq", function (req, res) {
    res.render('faq');
})

module.exports = router;