const VALID_ITEM_TYPES = ["task", "event"];
const VALID_ITEM_STATUSES = ["planned", "in_progress", "completed", "snoozed"];
const VALID_PRIORITIES = ["urgent", "important", "normal", "easy_win"];
const VALID_EFFORTS = ["low", "medium", "high"];
const VALID_PERMISSIONS = ["view", "edit"];

function pickEnum(value, options, fallback) {
  return options.includes(value) ? value : fallback;
}

function sanitizeText(value, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim();
}

function toIsoOrNull(value) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

function normalizeItemInput(body) {
  const type = pickEnum(body.type, VALID_ITEM_TYPES, "task");
  const status = pickEnum(body.status, VALID_ITEM_STATUSES, "planned");
  const priority = pickEnum(body.priority, VALID_PRIORITIES, "important");
  const effort = pickEnum(body.effort, VALID_EFFORTS, "medium");
  const title = sanitizeText(body.title);

  return {
    type,
    title,
    notes: sanitizeText(body.notes),
    category: sanitizeText(body.category),
    status,
    priority,
    effort,
    start_at: toIsoOrNull(body.startAt),
    end_at: toIsoOrNull(body.endAt),
    due_at: toIsoOrNull(body.dueAt),
    snoozed_until: toIsoOrNull(body.snoozedUntil),
    recurrence_rule: sanitizeText(body.recurrenceRule),
    is_all_day: Boolean(body.isAllDay),
  };
}

function buildReminderLabel(offsetMinutes) {
  if (!Number.isFinite(offsetMinutes)) {
    return "Reminder";
  }

  if (offsetMinutes >= 1440) {
    const days = Math.round(offsetMinutes / 1440);
    return `${days} day${days === 1 ? "" : "s"} before`;
  }

  if (offsetMinutes >= 60) {
    const hours = Math.round(offsetMinutes / 60);
    return `${hours} hour${hours === 1 ? "" : "s"} before`;
  }

  return `${offsetMinutes} min before`;
}

function normalizeReminderInput(reminders, itemInput) {
  if (!Array.isArray(reminders)) {
    return [];
  }

  const anchor = itemInput.type === "event"
    ? itemInput.start_at || itemInput.due_at
    : itemInput.due_at || itemInput.start_at;

  return reminders
    .map((entry) => {
      if (typeof entry === "number") {
        return {
          label: buildReminderLabel(entry),
          offset_minutes: entry,
          remind_at:
            anchor
              ? new Date(new Date(anchor).getTime() - entry * 60000).toISOString()
              : null,
          status: "scheduled",
        };
      }

      const offsetMinutes = Number(entry?.offsetMinutes);
      const remindAt = toIsoOrNull(entry?.remindAt);
      const label = sanitizeText(entry?.label) || buildReminderLabel(offsetMinutes);

      return {
        label,
        offset_minutes: Number.isFinite(offsetMinutes) ? offsetMinutes : null,
        remind_at:
          remindAt ||
          (anchor && Number.isFinite(offsetMinutes)
            ? new Date(new Date(anchor).getTime() - offsetMinutes * 60000).toISOString()
            : null),
        status: "scheduled",
      };
    })
    .filter((entry) => entry.remind_at || entry.offset_minutes !== null)
    .slice(0, 5);
}

function sameDay(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function getAnchorDate(item) {
  const source =
    item.snoozed_until ||
    item.due_at ||
    item.start_at ||
    item.end_at ||
    item.created_at;

  if (!source) {
    return null;
  }

  const parsed = new Date(source);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function priorityWeight(priority) {
  switch (priority) {
    case "urgent":
      return 0;
    case "important":
      return 1;
    case "normal":
      return 2;
    case "easy_win":
      return 3;
    default:
      return 4;
  }
}

function smartSort(items) {
  return [...items].sort((left, right) => {
    const leftComplete = left.status === "completed" ? 1 : 0;
    const rightComplete = right.status === "completed" ? 1 : 0;

    if (leftComplete !== rightComplete) {
      return leftComplete - rightComplete;
    }

    const priorityDiff = priorityWeight(left.priority) - priorityWeight(right.priority);
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    const leftDate = getAnchorDate(left)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const rightDate = getAnchorDate(right)?.getTime() ?? Number.MAX_SAFE_INTEGER;

    if (leftDate !== rightDate) {
      return leftDate - rightDate;
    }

    return left.title.localeCompare(right.title);
  });
}

function filterItemsByView(items, view) {
  const now = new Date();

  switch (view) {
    case "today":
      return items.filter((item) => {
        const anchor = getAnchorDate(item);
        return anchor && sameDay(anchor, now) && item.status !== "completed";
      });
    case "next_up":
      return items.filter((item) => {
        const anchor = getAnchorDate(item);

        if (!anchor || item.status === "completed") {
          return false;
        }

        const diffHours = (anchor.getTime() - now.getTime()) / 36e5;
        return diffHours >= 0 && diffHours <= 72;
      });
    case "overdue":
      return items.filter((item) => {
        const anchor = getAnchorDate(item);
        return anchor && anchor < now && item.status !== "completed";
      });
    case "easy_win":
      return items.filter((item) => item.effort === "low" && item.status !== "completed");
    case "shared":
      return items.filter((item) => !item.is_owner);
    case "completed":
      return items.filter((item) => item.status === "completed");
    case "all":
    default:
      return items;
  }
}

function buildDashboard(items) {
  const today = smartSort(filterItemsByView(items, "today")).slice(0, 6);
  const nextUp = smartSort(filterItemsByView(items, "next_up")).slice(0, 6);
  const overdue = smartSort(filterItemsByView(items, "overdue")).slice(0, 6);
  const easyWins = smartSort(filterItemsByView(items, "easy_win")).slice(0, 6);
  const shared = smartSort(filterItemsByView(items, "shared")).slice(0, 6);

  return {
    summary: {
      todayCount: today.length,
      nextUpCount: nextUp.length,
      overdueCount: overdue.length,
      easyWinCount: easyWins.length,
      sharedCount: shared.length,
      completedCount: filterItemsByView(items, "completed").length,
    },
    sections: {
      today,
      nextUp,
      overdue,
      easyWins,
      shared,
    },
  };
}

module.exports = {
  VALID_ITEM_TYPES,
  VALID_ITEM_STATUSES,
  VALID_PRIORITIES,
  VALID_EFFORTS,
  VALID_PERMISSIONS,
  normalizeItemInput,
  normalizeReminderInput,
  smartSort,
  filterItemsByView,
  buildDashboard,
  sanitizeText,
  toIsoOrNull,
};
