/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("events", (t) => {

    t.increments("id").primary();
    t.text("title").notNullable();
    t.integer("owner_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
    t.integer("calendar_id").unsigned().references("id").inTable("calendars").onDelete("CASCADE");
    t.text("description");
    t.date("date_start").notNullable();
    t.date("date_end");
    t.integer("time_estimate").notNullable();
    t.text("location");
    t.enu('priority', ['low', 'medium', 'high']).notNullable()
    t.boolean("repeat").defaultTo(false);
    t.boolean("task").notNullable();
    t.text("color");
  })

  await knex.schema.createTable("event_users", (t) => {

    t.increments("id").primary();
    t.integer("event_id").unsigned().references("id").inTable("events").onDelete("CASCADE");
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
