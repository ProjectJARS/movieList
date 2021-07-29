const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var Cookie = require("js-cookie");
var router = express.Router();

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"))
app.set('view engine', 'ejs');


const userSchema = {
    email: String,
    password: String
}

const User = require('D:/college/7th sem/project/mvc_arch_nodejs/models/userModel.js');

router.get("/register", function (req, res) {
    res.send('<h1>REGISTER</h1></h1> <form action="/register" method="POST"> <input type="email" id="email" name="email"><br>Password<input type="password" id="pass" name="password" required><input type="submit" value="GO"/></form>');
});


router.post("/register", (req, res) => {
    console.log(req.body)
    User.findOne({ email: req.body.email }, async (err, result) => {
        if (err) {
            res.sendStatus(501);
        }
        else if (!result) {
            try {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const data = new User({
                    email: req.body.email,
                    password: hashedPassword
                });
                data.save((err) => {
                    if (!err) {
                        const payload = { id: '123' };
                        const accessToken = jwt.sign(
                            payload,
                            'secret',
                            // {expiresIn:(2*10)}
                        );
                        res.cookie('access_token', accessToken);
                        res.redirect('/home');
                    }
                    else
                        res.send("Database Insertion error");
                });
            }
            catch (err) {
                console.log(err)
                res.status(500).send("Server Error")
            }
        }
        else {
            res.sendStatus(400)
        }

    })
})


module.exports = router;