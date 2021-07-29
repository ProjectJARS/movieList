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

router.get("/login", function (req, res) {
    res.send('<h1>REGISTER</h1></h1> <form action="/login" method="POST"> <input type="email" id="email" name="email"><br>Password<input type="password" id="pass" name="password" required><input type="submit" value="GO"/></form>');
});


router.post('/login', (req, res) => {
    const User = require('D:/college/7th sem/project/mvc_arch_nodejs/models/userModel.js');
    User.findOne({ email: req.body.email }, async (err, result) => {
        if (!err && result != null) {
            //console.log(result)
            if (await bcrypt.compare(req.body.password, result.password)) {
                //console.log("Login role:" + req.body.role)
                const payload = { id: '123' };
                const accessToken = jwt.sign(
                    payload,
                    'secret',
                    // {expiresIn:(2*10)}
                );
                res.cookie('access_token', accessToken);
                res.redirect('/home')

            }
            else {
                res.sendStatus(404);
            }
        }
        else {
            res.sendStatus(404)
        }
    })
})

module.exports = router;