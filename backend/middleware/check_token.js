const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken")

require("dotenv").config();

function checkToken(req, res, next){
    try {
        const token = req.cookies.login_token;
        const decoded = JWT.verify(token, process.env.JWT_SECRET)
        req.token = decoded
        next()
    } catch (err) {
        res.send(err)
    }
}

module.exports = {checkToken}