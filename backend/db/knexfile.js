// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, "../.env")});

module.exports = {

  development: {
    client: 'better-sqlite3',
    connection: {
      filename: path.resolve(__dirname, process.env.DATABASE),
    },
    useNullAsDefault: true
  },

};
