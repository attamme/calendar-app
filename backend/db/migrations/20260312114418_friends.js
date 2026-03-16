/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("friends", (t) => {

    t.increments("id").primary();
    t.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
    t.integer("friend_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("friends");
};
