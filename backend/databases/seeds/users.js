/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  
  const row = (o) => {
    id = o.id;
    username = o.username;
    password = o.password;
    isAdmin = o.isAdmin;
  }

  const data = [
    row({
      id: 1,
      username: "test",
      password: "passwd",
      isAdmin: false
    })]

  await knex('users').del()
  await knex('users').insert([
    {id: 1, colName: 'rowValue1'},
    {id: 2, colName: 'rowValue2'},
    {id: 3, colName: 'rowValue3'}
  ]);
};
