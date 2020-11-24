
const express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const date = require("../controllers/date.controller");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))
app.set('view engine', 'ejs');


router.get("/",function (req,res) {
	let day = date.getDate();
	res.render('homePage',{date:day});
})

module.exports = router;