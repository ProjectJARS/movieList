/*
This is the router
*/

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
require('dotenv').config();

var movie = require("./routes/movie");
/*var trialHomePage = require("./routes/trialHomePage");
app.use("/",trialHomePage);*/

//console.log("Called");

app.get("/movie", movie);
app.get("/", require("./routes/trialHomePage"));



app.get("/search_movie", function (req, res) {
  if (!req.query.movieId) {
    console.log("Hello")
    res.send('<form action ="/search_movie" method = "get">Movie ID:<input type="text" name="movieId"/><input type="submit" value="GO"></form>');
  }
  else {
    res.redirect("/movie?movieId=" + req.query.movieId);
  }

});



app.listen(3000, function () {
  console.log("Server started on port 3000");
});
