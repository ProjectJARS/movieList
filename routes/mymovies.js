const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
var router = express.Router();
const getMovieOrTvDetails = require("../models/getMovieOrTvDetails.js");
const checkContent = require("../models/checkValidity.js")

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set('view engine', 'ejs');

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/chillpill", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    keepAlive: true,
    bufferMaxEntries: 0,
    bufferCommands: false
})

const itemSchema = {
    type: String,
    id: String,
    poster_path: String,
}

const MyMovie = mongoose.model('Mymovie', itemSchema);


router.post("/addMovie", async function (req, res) {
    let type = req.body.type;
    let id = req.body.id;
    console.log(type);
    console.log(id);
    MyMovie.findOne({ id: req.body.id }, async (err, result) => {
        if (!err && result != null) {
            res.redirect('/myMovies');
            console.log(result);
        }
        else if (!result) {
            const data = new MyMovie({
                type: req.body.type,
                id: req.body.id,
                poster_path: req.body.poster_path
            });
            data.save((err) => {
                if (!err)
                    res.redirect('/myMovies')

                else
                    console.log(err);
            })
        }

    })


});


router.post("/removeMovie", async function (req, res) {
    let type = req.body.type;
    let id = req.body.id;
    console.log(type)
    console.log(id);
    MyMovie.deleteOne({ id: req.body.id }, function (err) {
        if (err) {
            res.redirect('/myMovies');
            console.log(result)
        }
        else {
            res.redirect('/myMovies');
        }
    });


});


router.get("/myMovies", async function (req, res) {
    MyMovie.find((err, results) => {
        if (!err) {
            const tvdata = results.filter(item => item.type == 'tv')
            const moviedata = results.filter(item => item.type == 'movie')
            let discoverTVorMovie = {
                discoverMovie: moviedata,
                discoverTV: tvdata
            }
            discoverTVorMovieString = JSON.stringify(discoverTVorMovie);
            //client.setex("discoverTVorMovieString", 3600, discoverTVorMovieString);
            //res.send(discoverTVorMovie);
            res.render('D:/college/7th sem/project/mvc_arch_nodejs/views/movieWebsite/index', {
                discoverTVorMovie: discoverTVorMovie,
                title: 'My List',
                addRemove: true
            });
        }
        else {
            // console.log("oops")
            res.sendStatus(500);
        }
    })
});

module.exports = router;
