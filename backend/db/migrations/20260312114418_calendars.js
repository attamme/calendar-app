/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("calendars", (t) => {

    t.increments("id").primary();
    t.text("title").notNullable();
    t.integer("owner_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
    t.text("color");
  })

  await knex.schema.createTable("calendar_users", (t) => {

    t.increments("id").primary();
    t.integer("title").notNullable();
    t.integer("calendar_id").unsigned().references("id").inTable("calendars").onDelete("CASCADE");
    t.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("calendars");
};
