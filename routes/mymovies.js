const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
var router = express.Router();
const getMovieOrTvDetails = require("../models/getMovieOrTvDetails.js");
const checkContent = require("../models/checkValidity.js")
const axios = require("axios")
const got = require('got');
const CircularJSON = require('circular-json')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set('view engine', 'ejs');

const mongoose = require('mongoose');
const { syncIndexes } = require("../models/userModel.js");
const { link } = require("fs");
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


async function generateResults(data) {

    let linksArr = [];
    for (let i = 0; i < data.length; i++) {
        linksArr.push("https://api.themoviedb.org/3/movie/" + data[i] + "?api_key=" + process.env.MOVIE_API_KEY + "&language=en-US")
    }
    return axios.all(linksArr.map(l => axios.get(l)))
        .then(await axios.spread(async function (...result) {
            console.log('i should go first')
            return result
        })).finally(() => {
            console.log("i should go second");
        });;
}



router.get("/getSimilar/:id", async function (req, res) {
    console.log(req.params.id)
    await axios.post('http://localhost:9000/', {
        "id": req.params.id
    })
        .then((result) => {
            console.log(result.data)
            console.log("in async");
            return new Promise(async function (resolve, reject) {
                const similarMovies = await generateResults(result.data)
                console.log(similarMovies)
                console.log("i should go third");
                //console.log(similarMovies);
                const str = CircularJSON.stringify(similarMovies);
                const ans2 = JSON.parse(str)
                let ans = [];
                for (let i = 0; i < ans2.length; i++) {
                    ans2[i].data["poster_path"] = "https://image.tmdb.org/t/p/w500" + ans2[i].data["poster_path"]
                    ans.push(ans2[i].data)
                }
                //await res.send(ans);
                let discoverTVorMovie = {
                    discoverMovie: ans,
                    discoverTV: ""
                }
                res.render('D:/college/7th sem/project/mvc_arch_nodejs/views/movieWebsite/index', {
                    discoverTVorMovie: discoverTVorMovie,
                    title: 'Recommendation',
                    addRemove: false
                });
            })
        })
})













module.exports = router;
