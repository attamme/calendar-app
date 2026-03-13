const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken")

require("dotenv").config();

function checkToken(req, res, next){
    try {
        const header = req.headers.authorization;
        if (!header){
            return res.status(401).send("No token provided");
        }

        const parts = header.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).send("Malformed token");
        }
        
        const token = header.split(" ")[1];
        const decoded = JWT.verify(token, process.env.JWT_SECRET)
        req.token = decoded
        next()
    } catch (err) {
        res.send(err)
    }
}

module.exports = {checkToken}