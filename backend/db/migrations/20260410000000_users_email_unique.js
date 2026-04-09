/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  const hasUsersTable = await knex.schema.hasTable("users");

  if (!hasUsersTable) {
    return;
  }

  const duplicateEmails = await knex("users")
    .select("email")
    .groupBy("email")
    .havingRaw("COUNT(*) > 1");

  if (duplicateEmails.length > 0) {
    throw new Error("Cannot apply unique email constraint while duplicate user emails exist.");
  }

  const indexes = await knex.raw("PRAGMA index_list('users')");
  const emailIndexExists = indexes.some((index) => index.name === "users_email_unique");

  if (!emailIndexExists) {
    await knex.schema.alterTable("users", (table) => {
      table.unique(["email"]);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  const hasUsersTable = await knex.schema.hasTable("users");

  if (!hasUsersTable) {
    return;
  }

  await knex.schema.alterTable("users", (table) => {
    table.dropUnique(["email"]);
  });
};
