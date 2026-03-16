/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  
  const row = (o) => { return {
    id: o.id,
    user_id: o.user_id,
    friend_id: o.friend_id,
    }
  }

  const data = [
    row({
      id: 1,
      user_id: 9,
      friend_id: 1
    })]

  await knex('friends').del()
  await knex('friends').insert(data);
};
