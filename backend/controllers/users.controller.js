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
            const user_token = JWT.sign({sub: user.id}, process.env.JWT_SECRET, { expiresIn: "1h" })
            res.json(user_token)
             } else {
            res.status(401).send("wrong username or password");
        }
        }

        
    } catch (err) {
        res.send(err)
    }
}

async function Add(req, res) {
    try {
        const friend = await knex("users").where("username", req.params.username).first();
        
        if (!friend) {res.status(401).send("user not found");} else {
            await knex("friends").insert({"user_id": req.token.sub, "friend_id": friend.id})
            res.send("added friend")
        }
    } catch (err) {
        res.status(401).send("something failed")
    }
}

async function ShowFriends(req, res) {
    try {
        const friends = await knex("friends").where("user_id", req.token.sub)
        
        if (!friends) {res.status(401).send("user not found");} else {
            res.json(friends)
        }
    } catch (err) {
        res.status(401).send("something failed")
    }
}

module.exports = { GetAll, PostNew, Login, Add, ShowFriends };