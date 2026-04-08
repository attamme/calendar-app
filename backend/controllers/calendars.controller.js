const knex = require("../utils/db");
const { areFriends, getCalendarAccess } = require("../utils/access");
const { sendError, sendSuccess } = require("../utils/http");
const { sanitizeText, VALID_PERMISSIONS } = require("../utils/planner");

async function loadAccessibleCalendars(userId) {
  const calendars = await knex("calendars as calendars")
    .leftJoin("calendar_users as shares", function joinShares() {
      this.on("calendars.id", "shares.calendar_id").andOn(
        "shares.user_id",
        "=",
        knex.raw("?", [userId])
      );
    })
    .join("users as owners", "calendars.owner_id", "owners.id")
    .where("calendars.owner_id", userId)
    .orWhere("shares.user_id", userId)
    .select(
      "calendars.id",
      "calendars.title",
      "calendars.color",
      "calendars.category",
      "calendars.description",
      "calendars.owner_id",
      "calendars.created_at",
      "owners.username as owner_username",
      "shares.permission as shared_permission"
    )
    .orderBy("calendars.title", "asc");

  const counts = await knex("planner_items")
    .whereIn(
      "calendar_id",
      calendars.map((calendar) => calendar.id)
    )
    .groupBy("calendar_id")
    .select("calendar_id")
    .count({ item_count: "id" });

  const countMap = new Map(counts.map((row) => [row.calendar_id, Number(row.item_count)]));

  return calendars.map((calendar) => ({
    ...calendar,
    is_owner: calendar.owner_id === userId,
    access_permission:
      calendar.owner_id === userId ? "owner" : calendar.shared_permission || "view",
    item_count: countMap.get(calendar.id) || 0,
  }));
}

async function listCalendars(req, res) {
  try {
    const calendars = await loadAccessibleCalendars(req.auth.userId);
    return sendSuccess(res, 200, { calendars });
  } catch (error) {
    return sendError(res, 500, "Failed to load calendars");
  }
}

async function createCalendar(req, res) {
  try {
    const title = sanitizeText(req.body.title);
    const color = sanitizeText(req.body.color, "#3D6BFF");
    const category = sanitizeText(req.body.category, "general");
    const description = sanitizeText(req.body.description);

    if (!title) {
      return sendError(res, 400, "Calendar title is required");
    }

    const [calendarId] = await knex("calendars").insert({
      title,
      color,
      category,
      description,
      owner_id: req.auth.userId,
    });

    const calendar = await knex("calendars").where({ id: calendarId }).first();

    return sendSuccess(res, 201, { calendar });
  } catch (error) {
    return sendError(res, 500, "Failed to create calendar");
  }
}

async function updateCalendar(req, res) {
  try {
    const calendarId = Number(req.params.id);
    const access = await getCalendarAccess(req.auth.userId, calendarId);

    if (!access?.canEdit) {
      return sendError(res, 403, "You do not have permission to edit this calendar");
    }

    const updates = {
      title: sanitizeText(req.body.title, access.calendar.title),
      color: sanitizeText(req.body.color, access.calendar.color || "#3D6BFF"),
      category: sanitizeText(req.body.category, access.calendar.category || "general"),
      description: sanitizeText(req.body.description, access.calendar.description || ""),
      is_archived: typeof req.body.isArchived === "boolean"
        ? req.body.isArchived
        : Boolean(access.calendar.is_archived),
      updated_at: new Date().toISOString(),
    };

    await knex("calendars").where({ id: calendarId }).update(updates);

    const calendar = await knex("calendars").where({ id: calendarId }).first();
    return sendSuccess(res, 200, { calendar });
  } catch (error) {
    return sendError(res, 500, "Failed to update calendar");
  }
}

async function shareCalendarWithUser(req, res, calendarId, friendLookup, permission) {
  const access = await getCalendarAccess(req.auth.userId, calendarId);

  if (!access?.canEdit || !access.isOwner) {
    return sendError(res, 403, "Only the calendar owner can share this calendar");
  }

  const normalizedPermission = VALID_PERMISSIONS.includes(permission) ? permission : "view";
  const lookupValue = sanitizeText(friendLookup);

  if (!lookupValue) {
    return sendError(res, 400, "Friend username or email is required");
  }

  const friend = await knex("users")
    .whereRaw("lower(username) = ?", [lookupValue.toLowerCase()])
    .orWhereRaw("lower(email) = ?", [lookupValue.toLowerCase()])
    .first();

  if (!friend) {
    return sendError(res, 404, "Friend not found");
  }

  const areConnected = await areFriends(req.auth.userId, friend.id);

  if (!areConnected) {
    return sendError(res, 400, "Add this user as a friend before sharing calendars");
  }

  await knex("calendar_users")
    .insert({
      adder_id: req.auth.userId,
      calendar_id: calendarId,
      user_id: friend.id,
      permission: normalizedPermission,
    })
    .onConflict(["calendar_id", "user_id"])
    .merge({
      adder_id: req.auth.userId,
      permission: normalizedPermission,
      created_at: new Date().toISOString(),
    });

  return sendSuccess(res, 201, {
    shared: {
      calendarId,
      userId: friend.id,
      permission: normalizedPermission,
    },
  });
}

async function shareCalendar(req, res) {
  try {
    return await shareCalendarWithUser(
      req,
      res,
      Number(req.params.id),
      req.body.username || req.body.email,
      req.body.permission
    );
  } catch (error) {
    return sendError(res, 500, "Failed to share calendar");
  }
}

async function shareCalendarLegacy(req, res) {
  try {
    return await shareCalendarWithUser(
      req,
      res,
      Number(req.body.calendar_id),
      req.body.username || req.body.email,
      req.body.permission
    );
  } catch (error) {
    return sendError(res, 500, "Failed to share calendar");
  }
}

module.exports = {
  listCalendars,
  createCalendar,
  updateCalendar,
  shareCalendar,
  shareCalendarLegacy,
  loadAccessibleCalendars,
};
