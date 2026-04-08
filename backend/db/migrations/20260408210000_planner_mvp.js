async function ensureColumn(knex, tableName, columnName, callback) {
  const hasColumn = await knex.schema.hasColumn(tableName, columnName);

  if (!hasColumn) {
    await knex.schema.alterTable(tableName, (table) => {
      callback(table);
    });
  }
}

exports.up = async function up(knex) {
  const hasUsers = await knex.schema.hasTable("users");
  if (!hasUsers) {
    await knex.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.text("username").notNullable();
      table.text("password").notNullable();
      table.text("email").notNullable();
      table.boolean("isAdmin").defaultTo(false);
    });
  }

  const hasFriends = await knex.schema.hasTable("friends");
  if (!hasFriends) {
    await knex.schema.createTable("friends", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
      table.integer("friend_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
    });
  }

  const hasCalendars = await knex.schema.hasTable("calendars");
  if (!hasCalendars) {
    await knex.schema.createTable("calendars", (table) => {
      table.increments("id").primary();
      table.text("title").notNullable();
      table.integer("owner_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
      table.text("color");
    });
  }

  const hasCalendarUsers = await knex.schema.hasTable("calendar_users");
  if (!hasCalendarUsers) {
    await knex.schema.createTable("calendar_users", (table) => {
      table.increments("id").primary();
      table.integer("adder_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
      table.integer("calendar_id").unsigned().references("id").inTable("calendars").onDelete("CASCADE");
      table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
    });
  }

  await ensureColumn(knex, "friends", "created_at", (table) => {
    table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
  });

  await ensureColumn(knex, "calendars", "category", (table) => {
    table.text("category").notNullable().defaultTo("general");
  });

  await ensureColumn(knex, "calendars", "description", (table) => {
    table.text("description").notNullable().defaultTo("");
  });

  await ensureColumn(knex, "calendars", "is_archived", (table) => {
    table.boolean("is_archived").notNullable().defaultTo(false);
  });

  await ensureColumn(knex, "calendars", "created_at", (table) => {
    table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
  });

  await ensureColumn(knex, "calendars", "updated_at", (table) => {
    table.datetime("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  await ensureColumn(knex, "calendar_users", "permission", (table) => {
    table.text("permission").notNullable().defaultTo("view");
  });

  await ensureColumn(knex, "calendar_users", "created_at", (table) => {
    table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
  });

  const hasPlannerItems = await knex.schema.hasTable("planner_items");
  if (!hasPlannerItems) {
    await knex.schema.createTable("planner_items", (table) => {
      table.increments("id").primary();
      table.integer("calendar_id").unsigned().references("id").inTable("calendars").onDelete("SET NULL");
      table.integer("owner_id").unsigned().references("id").inTable("users").onDelete("CASCADE").notNullable();
      table.text("type").notNullable().defaultTo("task");
      table.text("title").notNullable();
      table.text("notes").notNullable().defaultTo("");
      table.text("category").notNullable().defaultTo("");
      table.text("status").notNullable().defaultTo("planned");
      table.text("priority").notNullable().defaultTo("important");
      table.text("effort").notNullable().defaultTo("medium");
      table.datetime("start_at");
      table.datetime("end_at");
      table.datetime("due_at");
      table.datetime("snoozed_until");
      table.text("recurrence_rule").notNullable().defaultTo("");
      table.datetime("completed_at");
      table.boolean("is_all_day").notNullable().defaultTo(false);
      table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
      table.datetime("updated_at").notNullable().defaultTo(knex.fn.now());
    });
  }

  const hasItemReminders = await knex.schema.hasTable("item_reminders");
  if (!hasItemReminders) {
    await knex.schema.createTable("item_reminders", (table) => {
      table.increments("id").primary();
      table.integer("item_id").unsigned().references("id").inTable("planner_items").onDelete("CASCADE").notNullable();
      table.text("label").notNullable().defaultTo("Reminder");
      table.integer("offset_minutes");
      table.datetime("remind_at");
      table.text("status").notNullable().defaultTo("scheduled");
      table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
    });
  }

  const hasItemShares = await knex.schema.hasTable("item_shares");
  if (!hasItemShares) {
    await knex.schema.createTable("item_shares", (table) => {
      table.increments("id").primary();
      table.integer("item_id").unsigned().references("id").inTable("planner_items").onDelete("CASCADE").notNullable();
      table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE").notNullable();
      table.integer("shared_by_id").unsigned().references("id").inTable("users").onDelete("CASCADE").notNullable();
      table.text("permission").notNullable().defaultTo("view");
      table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
    });
  }

  await knex.raw("CREATE UNIQUE INDEX IF NOT EXISTS friends_user_friend_unique ON friends(user_id, friend_id)");
  await knex.raw("CREATE UNIQUE INDEX IF NOT EXISTS calendar_users_calendar_user_unique ON calendar_users(calendar_id, user_id)");
  await knex.raw("CREATE UNIQUE INDEX IF NOT EXISTS item_shares_item_user_unique ON item_shares(item_id, user_id)");
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("item_shares");
  await knex.schema.dropTableIfExists("item_reminders");
  await knex.schema.dropTableIfExists("planner_items");
};
