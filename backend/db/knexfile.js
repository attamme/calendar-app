// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const path = require("path");
module.exports = {

  development: {
    client: 'better-sqlite3',
    connection: {
      filename: path.resolve(__dirname, "db.sqlite3"),
    }
  },

};
