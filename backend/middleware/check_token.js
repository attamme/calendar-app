const JWT = require("jsonwebtoken");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

function checkToken(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).send("No token provided");
    }

    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).send("Malformed token");
    }

    const token = parts[1];
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.token = decoded;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
}

module.exports = { checkToken };
