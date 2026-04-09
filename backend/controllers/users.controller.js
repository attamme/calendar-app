const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const knex = require("../utils/db");
const { areFriends } = require("../utils/access");
const { sendError, sendSuccess } = require("../utils/http");
const { sanitizeText } = require("../utils/planner");

function createToken(userId) {
  return JWT.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

async function getSafeUserById(userId) {
  return knex("users")
    .select("id", "username", "email", "isAdmin")
    .where({ id: userId })
    .first();
}

async function getAll(req, res) {
  try {
    const users = await knex("users").select("id", "username", "email", "isAdmin");
    return sendSuccess(res, 200, users);
  } catch (error) {
    return sendError(res, 500, "Failed to load users");
  }
}

async function register(req, res) {
  try {
    const username = sanitizeText(req.body.username);
    const email = sanitizeText(req.body.email).toLowerCase();
    const password = sanitizeText(req.body.password);

    if (!username || !email || password.length < 6) {
      return sendError(res, 400, "Username, email, and a 6+ character password are required");
    }

    const existing = await knex("users")
      .whereRaw("lower(email) = ?", [email])
      .orWhereRaw("lower(username) = ?", [username.toLowerCase()])
      .first();

    if (existing) {
      return sendError(res, 409, "A user with that email or username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [userId] = await knex("users").insert({
      username,
      email,
      password: hashedPassword,
    });

    const user = await getSafeUserById(userId);
    const token = createToken(user.id);

    return sendSuccess(res, 201, { token, user });
  } catch (error) {
    return sendError(res, 500, "Registration failed");
  }
}

async function login(req, res) {
  try {
    const email = sanitizeText(req.body.email).toLowerCase();
    const password = sanitizeText(req.body.password);

    if (!email || !password) {
      return sendError(res, 400, "Email and password are required");
    }

    const user = await knex("users")
      .select("id", "username", "email", "password", "isAdmin")
      .whereRaw("lower(email) = ?", [email])
      .first();

    if (!user) {
      return sendError(res, 401, "Wrong email or password");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return sendError(res, 401, "Wrong email or password");
    }

    const token = createToken(user.id);

    return sendSuccess(res, 200, {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    return sendError(res, 500, "Login failed");
  }
}

async function me(req, res) {
  try {
    const user = await getSafeUserById(req.auth.userId);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    return sendSuccess(res, 200, { user });
  } catch (error) {
    return sendError(res, 500, "Failed to load current user");
  }
}

async function listFriends(req, res) {
  try {
    const friends = await knex("friends as friendships")
      .join("users as friends", "friendships.friend_id", "friends.id")
      .where("friendships.user_id", req.auth.userId)
      .select(
        "friends.id",
        "friends.username",
        "friends.email",
        "friendships.created_at as connected_at"
      )
      .orderBy("friends.username", "asc");

    return sendSuccess(res, 200, { friends });
  } catch (error) {
    return sendError(res, 500, "Failed to load friends");
  }
}

async function addFriendInternal(req, res, lookupValue) {
  try {
    const target = sanitizeText(lookupValue);

    if (!target) {
      return sendError(res, 400, "Friend username or email is required");
    }

    const friend = await knex("users")
      .whereRaw("lower(username) = ?", [target.toLowerCase()])
      .orWhereRaw("lower(email) = ?", [target.toLowerCase()])
      .first();

    if (!friend) {
      return sendError(res, 404, "Friend not found");
    }

    if (friend.id === req.auth.userId) {
      return sendError(res, 400, "You cannot add yourself as a friend");
    }

    const alreadyFriends = await areFriends(req.auth.userId, friend.id);

    if (!alreadyFriends) {
      await knex.transaction(async (trx) => {
        await trx("friends")
          .insert({
            user_id: req.auth.userId,
            friend_id: friend.id,
          })
          .onConflict(["user_id", "friend_id"])
          .ignore();

        await trx("friends")
          .insert({
            user_id: friend.id,
            friend_id: req.auth.userId,
          })
          .onConflict(["user_id", "friend_id"])
          .ignore();
      });
    }

    const connection = await knex("friends")
      .where({
        user_id: req.auth.userId,
        friend_id: friend.id,
      })
      .select("created_at")
      .first();

    return sendSuccess(res, 201, {
      friend: {
        id: friend.id,
        username: friend.username,
        email: friend.email,
        connected_at: connection?.created_at || new Date().toISOString(),
      },
      alreadyConnected: alreadyFriends,
    });
  } catch (error) {
    return sendError(res, 500, "Failed to add friend");
  }
}

async function addFriend(req, res) {
  return addFriendInternal(req, res, req.body.username || req.body.email);
}

async function addFriendFromParams(req, res) {
  return addFriendInternal(req, res, req.params.username);
}

module.exports = {
  getAll,
  register,
  login,
  me,
  listFriends,
  addFriend,
  addFriendFromParams,
};
