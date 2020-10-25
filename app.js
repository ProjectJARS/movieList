/*
This is the router
*/

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))
app.set('view engine', 'ejs');


var trialHomePage = require("./routes/trialHomePage");



app.use("/",trialHomePage);


app.listen(3000, function() {
    console.log("Server started on port 3000")
});