exports.up = async function up(knex) {
  const hasColumn = await knex.schema.hasColumn("item_shares", "target_calendar_id");

  if (!hasColumn) {
    await knex.schema.alterTable("item_shares", (table) => {
      table
        .integer("target_calendar_id")
        .unsigned()
        .references("id")
        .inTable("calendars")
        .onDelete("SET NULL");
    });
  }
};

exports.down = async function down(knex) {
  const hasColumn = await knex.schema.hasColumn("item_shares", "target_calendar_id");

  if (hasColumn) {
    await knex.schema.alterTable("item_shares", (table) => {
      table.dropColumn("target_calendar_id");
    });
  }
};
