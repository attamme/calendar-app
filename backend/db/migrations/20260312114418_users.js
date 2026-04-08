/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("users", (t) => {

    t.increments("id").primary();
    t.text("username").unique().notNullable();
    t.text("password").notNullable();
    t.text("email").notNullable();
    t.boolean("isAdmin").defaultTo(false);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("users");
};
