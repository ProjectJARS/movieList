const express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set('view engine', 'ejs');


router.get("/register", function (req, res) {
    res.send('<h1>REGISTER</h1></h1>Email:<input type="email" id="email" name="email"><br>Password<input type="password" id="pass" name="password" minlength="8" required>');
});

module.exports = router;