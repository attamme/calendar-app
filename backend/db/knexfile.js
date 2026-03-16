// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
require("dotenv").config();
const path = require("path");
module.exports = {

  development: {
    client: 'better-sqlite3',
    connection: {
      filename: path.resolve(__dirname, process.env.DATABASE),
    },
    useNullAsDefault: true
  },

};
