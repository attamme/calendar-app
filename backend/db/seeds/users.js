/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  
  const row = (o) => { return {
    id: o.id,
    username: o.username,
    password: o.password,
    isAdmin: o.isAdmin,
    }
  }

  const data = [
    row({
      id: 1,
      username: "test",
      password: "passwd",
      isAdmin: false
    })]

  await knex('users').del()
  await knex('users').insert(data);
};
