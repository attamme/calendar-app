function pad(value: number) {
  return String(value).padStart(2, "0");
}

function parseDateInput(value?: string | Date | null) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function isValidDateParts(year: number, month: number, day: number, hour: number, minute: number) {
  const date = new Date(year, month - 1, day, hour, minute, 0, 0);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getHours() === hour &&
    date.getMinutes() === minute
  );
}

function formatLocalDateTime(date: Date) {
  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    " ",
    pad(date.getHours()),
    ":",
    pad(date.getMinutes()),
  ].join("");
}

function buildLocalDate(daysFromToday: number, hour: number, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  date.setHours(hour, minute, 0, 0);
  return date;
}

export function toInputDateTime(value?: string | Date | null) {
  if (!value) {
    return "";
  }

  const date = parseDateInput(value);

  if (!date) {
    return "";
  }

  return formatLocalDateTime(date);
}

export function fromInputDateTime(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const normalized = trimmed.replace("T", " ");
  const [datePart, timePart = "00:00"] = normalized.split(" ");
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);
  const timeMatch = /^(\d{1,2}):(\d{2})$/.exec(timePart);

  if (!dateMatch || !timeMatch) {
    return "";
  }

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);

  if (!isValidDateParts(year, month, day, hour, minute)) {
    return "";
  }

  const date = new Date(year, month - 1, day, hour, minute, 0, 0);
  return date.toISOString();
}

export function formatRelativeDate(value?: string | null) {
  const date = parseDateInput(value);

  if (!date) {
    return "No schedule";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatDayLabel(value?: string | null) {
  const date = parseDateInput(value);

  if (!date) {
    return "Anytime";
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatTimeOnly(value?: string | Date | null) {
  const date = parseDateInput(value);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getDateKey(value?: string | Date | null) {
  const date = parseDateInput(value);

  if (!date) {
    return "";
  }

  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
  ].join("");
}

export function isSameCalendarDay(left?: string | Date | null, right?: string | Date | null) {
  const leftDate = parseDateInput(left);
  const rightDate = parseDateInput(right);

  if (!leftDate || !rightDate) {
    return false;
  }

  return (
    leftDate.getFullYear() === rightDate.getFullYear() &&
    leftDate.getMonth() === rightDate.getMonth() &&
    leftDate.getDate() === rightDate.getDate()
  );
}

export function isToday(value?: string | Date | null) {
  return isSameCalendarDay(value, new Date());
}

export function addMonths(value: Date, amount: number) {
  const date = new Date(value.getFullYear(), value.getMonth(), 1);
  date.setMonth(date.getMonth() + amount);
  return date;
}

export function getMonthLabel(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(value);
}

export function getWeekdayLabels() {
  const monday = new Date(2026, 0, 5);

  return Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
      new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index)
    )
  );
}

export function buildMonthGrid(month: Date) {
  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const weekday = firstOfMonth.getDay();
  const mondayOffset = (weekday + 6) % 7;
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

export function plusHours(hours: number) {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  date.setMinutes(0, 0, 0);
  return date.toISOString();
}

export function todayAt(hour: number, minute = 0) {
  return buildLocalDate(0, hour, minute).toISOString();
}

export function tomorrowAt(hour: number, minute = 0) {
  return buildLocalDate(1, hour, minute).toISOString();
}

export function nextOccurrenceAt(hour: number, minute = 0) {
  const now = new Date();
  const today = buildLocalDate(0, hour, minute);

  if (today.getTime() >= now.getTime()) {
    return today.toISOString();
  }

  return buildLocalDate(1, hour, minute).toISOString();
}

export function plusDays(days: number, hour = 9, minute = 0) {
  return buildLocalDate(days, hour, minute).toISOString();
}
