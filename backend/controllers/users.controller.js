const knex = require("knex")(require("../db/knexfile").development);

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

module.exports = { GetAll };