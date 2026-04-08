export type ItemType = "task" | "event";
export type ItemStatus = "planned" | "in_progress" | "completed" | "snoozed";
export type ItemPriority = "urgent" | "important" | "normal" | "easy_win";
export type ItemEffort = "low" | "medium" | "high";
export type SharePermission = "owner" | "view" | "edit";

export type SessionUser = {
  id: number;
  username: string;
  email: string;
  isAdmin?: boolean;
};

export type Reminder = {
  id?: number;
  item_id?: number;
  label: string;
  offset_minutes: number | null;
  remind_at: string | null;
  status: string;
};

export type ItemShare = {
  id: number;
  item_id: number;
  user_id: number;
  permission: SharePermission;
  username: string;
  email: string;
};

export type PlannerItem = {
  id: number;
  calendar_id: number | null;
  owner_id: number;
  type: ItemType;
  title: string;
  notes: string;
  category: string;
  status: ItemStatus;
  priority: ItemPriority;
  effort: ItemEffort;
  start_at: string | null;
  end_at: string | null;
  due_at: string | null;
  snoozed_until: string | null;
  recurrence_rule: string;
  completed_at: string | null;
  is_all_day: boolean;
  created_at: string;
  updated_at: string;
  calendar_title?: string | null;
  calendar_color?: string | null;
  owner_username?: string;
  is_owner: boolean;
  reminders: Reminder[];
  shares: ItemShare[];
};

export type PlannerDashboard = {
  summary: {
    todayCount: number;
    nextUpCount: number;
    overdueCount: number;
    easyWinCount: number;
    sharedCount: number;
    completedCount: number;
  };
  sections: {
    today: PlannerItem[];
    nextUp: PlannerItem[];
    overdue: PlannerItem[];
    easyWins: PlannerItem[];
    shared: PlannerItem[];
  };
};

export type PlannerCalendar = {
  id: number;
  title: string;
  color: string;
  category: string;
  description: string;
  owner_id: number;
  owner_username?: string;
  created_at: string;
  shared_permission?: SharePermission;
  access_permission: SharePermission;
  is_owner: boolean;
  item_count: number;
};

export type FriendConnection = {
  id: number;
  username: string;
  email: string;
  connected_at: string;
};

export type ReminderDraft = {
  label: string;
  offsetMinutes: number;
};

export type PlannerItemPayload = {
  calendarId?: number | null;
  type: ItemType;
  title: string;
  notes?: string;
  category?: string;
  status?: ItemStatus;
  priority?: ItemPriority;
  effort?: ItemEffort;
  startAt?: string;
  endAt?: string;
  dueAt?: string;
  snoozedUntil?: string;
  recurrenceRule?: string;
  isAllDay?: boolean;
  reminders?: Array<number | ReminderDraft>;
};
