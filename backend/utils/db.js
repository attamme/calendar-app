const knex = require("knex")(require("../db/knexfile").development);

module.exports = knex;
