const knex = require("../utils/db");
const {
  areFriends,
  getCalendarAccess,
  getAccessibleCalendarIds,
  getDirectlySharedItemIds,
  getItemAccess,
} = require("../utils/access");
const { sendError, sendSuccess } = require("../utils/http");
const {
  VALID_PERMISSIONS,
  buildDashboard,
  filterItemsByView,
  normalizeItemInput,
  normalizeReminderInput,
  smartSort,
  sanitizeText,
} = require("../utils/planner");

async function hydrateItems(items, userId) {
  if (!items.length) {
    return [];
  }

  const itemIds = items.map((item) => item.id);

  const reminders = await knex("item_reminders")
    .whereIn("item_id", itemIds)
    .orderBy("remind_at", "asc");

  const shares = await knex("item_shares as shares")
    .join("users as users", "shares.user_id", "users.id")
    .whereIn("shares.item_id", itemIds)
    .select(
      "shares.id",
      "shares.item_id",
      "shares.user_id",
      "shares.permission",
      "users.username",
      "users.email"
    );

  const reminderMap = new Map();
  const shareMap = new Map();

  reminders.forEach((reminder) => {
    const current = reminderMap.get(reminder.item_id) || [];
    current.push(reminder);
    reminderMap.set(reminder.item_id, current);
  });

  shares.forEach((share) => {
    const current = shareMap.get(share.item_id) || [];
    current.push(share);
    shareMap.set(share.item_id, current);
  });

  return items.map((item) => ({
    ...item,
    is_owner: item.owner_id === userId,
    reminders: reminderMap.get(item.id) || [],
    shares: shareMap.get(item.id) || [],
  }));
}

async function queryAccessibleItems(userId) {
  const calendarIds = await getAccessibleCalendarIds(userId);
  const sharedItemIds = await getDirectlySharedItemIds(userId);

  const query = knex("planner_items as items")
    .leftJoin("calendars as calendars", "items.calendar_id", "calendars.id")
    .leftJoin("users as owners", "items.owner_id", "owners.id")
    .select(
      "items.id",
      "items.calendar_id",
      "items.owner_id",
      "items.type",
      "items.title",
      "items.notes",
      "items.category",
      "items.status",
      "items.priority",
      "items.effort",
      "items.start_at",
      "items.end_at",
      "items.due_at",
      "items.snoozed_until",
      "items.recurrence_rule",
      "items.completed_at",
      "items.is_all_day",
      "items.created_at",
      "items.updated_at",
      "calendars.title as calendar_title",
      "calendars.color as calendar_color",
      "owners.username as owner_username"
    )
    .where("items.owner_id", userId);

  if (calendarIds.length) {
    query.orWhereIn("items.calendar_id", calendarIds);
  }

  if (sharedItemIds.length) {
    query.orWhereIn("items.id", sharedItemIds);
  }

  const items = await query.orderBy("items.updated_at", "desc");
  return hydrateItems(items, userId);
}

async function dashboard(req, res) {
  try {
    const items = await queryAccessibleItems(req.auth.userId);
    return sendSuccess(res, 200, buildDashboard(items));
  } catch (error) {
    return sendError(res, 500, "Failed to build dashboard");
  }
}

async function listItems(req, res) {
  try {
    const items = await queryAccessibleItems(req.auth.userId);
    const view = sanitizeText(req.query.view, "all");
    const type = sanitizeText(req.query.type);
    const calendarId = Number(req.query.calendarId);
    const status = sanitizeText(req.query.status);

    let filtered = filterItemsByView(items, view);

    if (type) {
      filtered = filtered.filter((item) => item.type === type);
    }

    if (Number.isFinite(calendarId) && calendarId > 0) {
      filtered = filtered.filter((item) => item.calendar_id === calendarId);
    }

    if (status) {
      filtered = filtered.filter((item) => item.status === status);
    }

    return sendSuccess(res, 200, {
      items: smartSort(filtered),
    });
  } catch (error) {
    return sendError(res, 500, "Failed to load items");
  }
}

async function getItem(req, res) {
  try {
    const itemId = Number(req.params.id);
    const access = await getItemAccess(req.auth.userId, itemId);

    if (!access?.canView) {
      return sendError(res, 404, "Item not found");
    }

    const items = await queryAccessibleItems(req.auth.userId);
    const item = items.find((entry) => entry.id === itemId);

    if (!item) {
      return sendError(res, 404, "Item not found");
    }

    return sendSuccess(res, 200, { item });
  } catch (error) {
    return sendError(res, 500, "Failed to load item");
  }
}

async function persistReminders(trx, itemId, reminders) {
  await trx("item_reminders").where({ item_id: itemId }).del();

  if (!reminders.length) {
    return;
  }

  await trx("item_reminders").insert(
    reminders.map((reminder) => ({
      item_id: itemId,
      label: reminder.label,
      offset_minutes: reminder.offset_minutes,
      remind_at: reminder.remind_at,
      status: reminder.status,
    }))
  );
}

async function createItem(req, res) {
  try {
    const input = normalizeItemInput(req.body);

    if (!input.title) {
      return sendError(res, 400, "Item title is required");
    }

    if (req.body.calendarId) {
      const calendarAccess = await getCalendarAccess(
        req.auth.userId,
        Number(req.body.calendarId)
      );

      if (!calendarAccess?.canEdit) {
        return sendError(res, 403, "You cannot create items in that calendar");
      }
    }

    const reminders = normalizeReminderInput(req.body.reminders, input);

    const [itemId] = await knex.transaction(async (trx) => {
      const [createdId] = await trx("planner_items").insert({
        ...input,
        calendar_id: req.body.calendarId ? Number(req.body.calendarId) : null,
        owner_id: req.auth.userId,
        completed_at: input.status === "completed" ? new Date().toISOString() : null,
      });

      await persistReminders(trx, createdId, reminders);

      return [createdId];
    });

    const items = await queryAccessibleItems(req.auth.userId);
    const item = items.find((entry) => entry.id === itemId);

    return sendSuccess(res, 201, { item });
  } catch (error) {
    return sendError(res, 500, "Failed to create item");
  }
}

async function updateItem(req, res) {
  try {
    const itemId = Number(req.params.id);
    const access = await getItemAccess(req.auth.userId, itemId);

    if (!access?.canEdit) {
      return sendError(res, 403, "You do not have permission to edit this item");
    }

    const input = normalizeItemInput({
      ...access.item,
      ...req.body,
    });

    if (!input.title) {
      return sendError(res, 400, "Item title is required");
    }

    if (req.body.calendarId) {
      const calendarAccess = await getCalendarAccess(
        req.auth.userId,
        Number(req.body.calendarId)
      );

      if (!calendarAccess?.canEdit) {
        return sendError(res, 403, "You cannot move this item into that calendar");
      }
    }

    const reminders = Array.isArray(req.body.reminders)
      ? normalizeReminderInput(req.body.reminders, input)
      : null;

    await knex.transaction(async (trx) => {
      await trx("planner_items")
        .where({ id: itemId })
        .update({
          ...input,
          calendar_id: req.body.calendarId
            ? Number(req.body.calendarId)
            : access.item.calendar_id,
          completed_at:
            input.status === "completed"
              ? access.item.completed_at || new Date().toISOString()
              : null,
          updated_at: new Date().toISOString(),
        });

      if (reminders) {
        await persistReminders(trx, itemId, reminders);
      }
    });

    const items = await queryAccessibleItems(req.auth.userId);
    const item = items.find((entry) => entry.id === itemId);

    return sendSuccess(res, 200, { item });
  } catch (error) {
    return sendError(res, 500, "Failed to update item");
  }
}

async function shareItem(req, res) {
  try {
    const itemId = Number(req.params.id);
    const access = await getItemAccess(req.auth.userId, itemId);

    if (!access?.isOwner) {
      return sendError(res, 403, "Only the item owner can share this item directly");
    }

    const lookupValue = sanitizeText(req.body.username || req.body.email);
    const permission = VALID_PERMISSIONS.includes(req.body.permission)
      ? req.body.permission
      : "view";

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
      return sendError(res, 400, "Add this user as a friend before sharing items");
    }

    await knex("item_shares")
      .insert({
        item_id: itemId,
        user_id: friend.id,
        shared_by_id: req.auth.userId,
        permission,
      })
      .onConflict(["item_id", "user_id"])
      .merge({
        permission,
        shared_by_id: req.auth.userId,
        created_at: new Date().toISOString(),
      });

    return sendSuccess(res, 201, {
      shared: {
        itemId,
        userId: friend.id,
        permission,
      },
    });
  } catch (error) {
    return sendError(res, 500, "Failed to share item");
  }
}

module.exports = {
  dashboard,
  listItems,
  getItem,
  createItem,
  updateItem,
  shareItem,
};
