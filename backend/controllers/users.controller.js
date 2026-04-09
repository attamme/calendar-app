const knex = require("knex")(require("../db/knexfile").development);
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

require("dotenv").config();

function serializeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

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
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email, and password are required" });
    }

    const existingUser = await knex("users")
      .select("id", "username", "email")
      .where("username", username)
      .orWhere("email", email)
      .first();

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }

      return res.status(400).json({ message: "Username already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [userId] = await knex("users").insert({
      username,
      password: hashed,
      email,
    });

    const createdUser = await knex("users")
      .select("id", "username", "email")
      .where("id", userId)
      .first();

    res.status(201).json({
      message: "Successfully created a user!",
      user: serializeUser(createdUser),
    });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE" || err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function Login(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await knex("users")
      .select("password", "id", "username", "email")
      .where("email", email)
      .first();

    if (!user) {
      return res.status(401).json({ message: "Wrong email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Wrong email or password" });
    }

    const token = JWT.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: serializeUser(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
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
    const user = await knex("users")
      .select("id", "username", "email")
      .where("id", req.token.sub)
      .first();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: serializeUser(user),
      preferences: {
        notificationsEnabled: true,
        popupNotifications: true,
        reminderFrequency: "1 hour",
        theme: "light",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { GetAll, Register, Login, Add, ShowFriends, getMyInfo };
