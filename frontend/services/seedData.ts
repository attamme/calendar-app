import { CalendarEvent } from "@/components/MonthlyCalendar";

export type ReminderRecord = {
  id: string;
  title: string;
  description: string;
  day: number;
  category: string;
  type: "task" | "event";
  color: string;
};

export const dashboardCalendars = ["All", "Work"] as const;

export const todayReminder: ReminderRecord = {
  id: "reminder-1",
  title: "Today",
  description:
    "The task description is written here, just write anything here. You can tap this to extend it. I repeat the task description is written here, just write anything here. You can tap this to extend it.",
  day: 6,
  category: "Work",
  type: "task",
  color: "#FF373E",
};

export const taskStrip = [
  "Clean room",
  "Write report",
  "Send draft",
  "Call dad",
  "Prepare docs",
] as const;

export const calendarEvents: CalendarEvent[] = [
  {
    id: "event-1",
    label: "Commit crimes",
    weekIndex: 0,
    startDay: 1,
    endDay: 7,
    color: "#6A5AFC",
  },
  {
    id: "event-2",
    weekIndex: 1,
    startDay: 1,
    endDay: 5,
    color: "#26FF00",
  },
  {
    id: "event-3",
    weekIndex: 1,
    startDay: 4,
    endDay: 4,
    color: "#FF373E",
  },
];

export const remindersByDay: Record<number, ReminderRecord[]> = {
  6: [
    todayReminder,
    {
      id: "event-2",
      title: "13:30 Team sync",
      description: "Short calendar event with the work calendar group.",
      day: 6,
      category: "Work",
      type: "event",
      color: "#6A5AFC",
    },
  ],
  14: [
    {
      id: "task-14",
      title: "Buy groceries",
      description: "Pick up bread, fruit, and ingredients for dinner.",
      day: 14,
      category: "All",
      type: "task",
      color: "#FF373E",
    },
  ],
};
