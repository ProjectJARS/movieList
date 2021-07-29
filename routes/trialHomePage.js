/*
	Even though folder is named as "routes", contents in this folder act as
	the controller
*/

const express = require("express");
const jwt = require('jsonwebtoken');
var router = express.Router();
const bodyParser = require("body-parser");
const date = require("../models/date.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set('view engine', 'ejs');


router.get("/home", function (req, res) {
	// let day = date.getDate();
	res.render('homePage');
	//res.render('D:/college/7th sem/project/mvc_arch_nodejs/views/movieWebsite/index');
	//res.send('<a href = "/login" ><input type = "button" value="Login"></a><br><a href = "/register" ><input type = "button" value="Register"></a>');
	//res.redirect('/discover')

})

router.get("/", function (req, res) {
	// let day = date.getDate();
	res.render('home');
	//res.render('D:/college/7th sem/project/mvc_arch_nodejs/views/movieWebsite/index');
	//res.send('<a href = "/login" ><input type = "button" value="Login"></a><br><a href = "/register" ><input type = "button" value="Register"></a>');
	//res.redirect('/discover')
	//res.send("login/registration");
})

/*
function authenticateToken(req, res, next) {
	// console.log('in authToken')
	// console.log(req.headers['authorization']);
	console.log(req.headers.cookie)

	const jwtCookie = req.headers.cookie.split(";").find(c => c.trim().startsWith('access_token='));
	const token = jwtCookie.split('=')[1];

	console.log(token)
	if (token == null) {
		console.log('here')
		res.redirect('/');
	}
	else {
		try {
			jwt.verify(token, 'secret', (err, data) => {
				if (err) {
					res.redirect('/');
				}
				next()
			})
		} catch (e) {
			console.log(e)
			res.redirect('/');

		}
	}
}
*/
module.exports = router;