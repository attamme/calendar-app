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

async function Register(req, res) {
    try {
        const hashed = await bcrypt.hash(req.body.password, 10);
        
        await knex("users").insert({
            username: req.body.username, 
            password: hashed, 
            email: req.body.email
        });

        res.status(201).json("Successfully created a user!");

    } catch (err) {

        if (err.code === '23505' || err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json("Username or email already exists");
        }

        console.error(err);
        res.status(500).json("Internal server error");
    }
}

async function Login(req, res) {
    try {
        const user = await knex("users").select("password", "id", "username", "email").where("email", req.body.email).andWhere("username", req.body.username).first();
        
        if (!user) {res.status(401).send("wrong email or password");} else {
            const check = await bcrypt.compare(req.body.password, user.password);
            if (check) {
            const user_token = JWT.sign({sub: user.id}, process.env.JWT_SECRET, { expiresIn: "1h" })
            res.json(user_token)
             } else {
            res.status(401).send("wrong email or password");
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

async function getMyInfo(req, res) {
    try {
        const user = await knex("users").select("*").where("id", req.token.sub).first();
        res.json(user)
    } catch (error) {
        res.send("went wrong")
    }
}

module.exports = { GetAll, Register, Login, Add, ShowFriends, getMyInfo };