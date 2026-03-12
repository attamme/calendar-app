const knex = require("knex")(require("../db/knexfile").development);
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken")

require("dotenv").config();

async function GetAll(req, res) {
  try {
    const users = await knex("users").select("*");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
      code: err.code,
    });
  }
}

async function PostNew(req, res) {
    try {
        const hashed = await bcrypt.hash(req.body.password, 10)
        knex("users").insert({username: req.body.username, password: hashed})
        .then(res.send("Successfully created a user!"))
        .catch((err) => console.error(err))
    } catch (err) {
        res.send(err)
    }
}

async function Login(req, res) {
    try {
        const user = await knex("users").select("password", "id", "username").where("username", req.body.username).first();
        
        if (!user) {res.status(401).send("wrong username or password");} else {
            const check = await bcrypt.compare(req.body.password, user.password);
            if (check) {
            const user_cookie = JWT.sign({sub: user.id}, process.env.JWT_SECRET, { expiresIn: "1h" })
            res.cookie("login_token", user_cookie, 
                {
                httpOnly: true,
                secure: false
                })
            res.send("login ok");
             } else {
            res.status(401).send("wrong username or password");
        }
        }

        
    } catch (err) {
        res.send(err)
    }
}

module.exports = { GetAll, PostNew, Login };