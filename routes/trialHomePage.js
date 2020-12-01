/*
	Even though folder is named as "routes", contents in this folder act as
	the controller
*/

const express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const date = require("../models/date.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set('view engine', 'ejs');


router.get("/", function (req, res) {
	// let day = date.getDate();
	// res.render('homePage',{date:day});

	res.send('<a href = "/login" ><input type = "button" value="Login"></a><br><a href = "/register" ><input type = "button" value="Register"></a>');

})

module.exports = router;