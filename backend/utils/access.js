const knex = require("./db");

async function areFriends(userId, friendId) {
  const friendship = await knex("friends")
    .where({
      user_id: userId,
      friend_id: friendId,
    })
    .first();

  return Boolean(friendship);
}

async function getCalendarAccess(userId, calendarId) {
  const calendar = await knex("calendars").where({ id: calendarId }).first();

  if (!calendar) {
    return null;
  }

  if (calendar.owner_id === userId) {
    return {
      calendar,
      permission: "owner",
      isOwner: true,
      canView: true,
      canEdit: true,
    };
  }

  const membership = await knex("calendar_users")
    .where({
      calendar_id: calendarId,
      user_id: userId,
    })
    .first();

  if (!membership) {
    return {
      calendar,
      permission: null,
      isOwner: false,
      canView: false,
      canEdit: false,
    };
  }

  return {
    calendar,
    permission: membership.permission || "view",
    isOwner: false,
    canView: true,
    canEdit: membership.permission === "edit",
  };
}

async function getAccessibleCalendarIds(userId) {
  const rows = await knex("calendars as calendars")
    .leftJoin("calendar_users as shares", "calendars.id", "shares.calendar_id")
    .where("calendars.owner_id", userId)
    .orWhere("shares.user_id", userId)
    .distinct("calendars.id");

  return rows.map((row) => row.id);
}

async function getDirectlySharedItemIds(userId) {
  const rows = await knex("item_shares")
    .where({
      user_id: userId,
    })
    .distinct("item_id");

  return rows.map((row) => row.item_id);
}

async function getItemAccess(userId, itemId) {
  const item = await knex("planner_items").where({ id: itemId }).first();

  if (!item) {
    return null;
  }

  if (item.owner_id === userId) {
    return {
      item,
      permission: "owner",
      isOwner: true,
      canView: true,
      canEdit: true,
    };
  }

  const directShare = await knex("item_shares")
    .where({
      item_id: itemId,
      user_id: userId,
    })
    .first();

  const calendarAccess = item.calendar_id
    ? await getCalendarAccess(userId, item.calendar_id)
    : null;

  return {
    item,
    permission: directShare?.permission || calendarAccess?.permission || null,
    isOwner: false,
    canView: Boolean(directShare) || Boolean(calendarAccess?.canView),
    canEdit:
      directShare?.permission === "edit" ||
      Boolean(calendarAccess?.canEdit),
  };
}

module.exports = {
  areFriends,
  getCalendarAccess,
  getAccessibleCalendarIds,
  getDirectlySharedItemIds,
  getItemAccess,
};
