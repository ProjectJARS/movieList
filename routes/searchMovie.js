const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
var router = express.Router();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set('view engine', 'ejs');

router.get("/search", function (req, res) {
    if (!req.query.searchId) {
        console.log("Hello")
        res.send('<form action ="/search" method = "get">Movie ID:<input type="text" name="searchId"/><br>Type:<input type="text" name="type"><input type="submit" value="GO"></form>');
    }
    else {
        console.log();
        if ((req.query.type).toLocaleLowerCase() === "movie")
            res.redirect("/movie?searchId=" + req.query.searchId + "&type=" + req.query.type);
        else if ((req.query.type).toLocaleLowerCase() === "tv") {
            res.redirect("/tv?searchId=" + req.query.searchId + "&type=" + req.query.type);
        }
        else {
            res.send("Invalid Arguments");
        }
    }

});

module.exports = router;