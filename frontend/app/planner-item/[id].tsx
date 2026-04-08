import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { startTransition, useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Button from "@/components/button";
import Chip from "@/components/Chip";
import InputText from "@/components/InputText";
import { useAuth } from "@/providers/AuthProvider";
import {
  createItem,
  fetchCalendars,
  fetchFriends,
  fetchItem,
  shareItem,
  updateItem,
} from "@/services/api";
import { theme } from "@/theme/tokens";
import type {
  FriendConnection,
  ItemEffort,
  ItemPriority,
  ItemStatus,
  ItemType,
  PlannerCalendar,
  PlannerItem,
  SharePermission,
} from "@/types/planner";
import { fromInputDateTime, plusDays, plusHours, toInputDateTime } from "@/utils/dates";

const reminderOptions = [
  { label: "10 min", value: 10, tone: "coral" as const },
  { label: "1 hour", value: 60, tone: "accent" as const },
  { label: "2 hours", value: 120, tone: "mint" as const },
  { label: "1 day", value: 1440, tone: "amber" as const },
];

const recurrenceOptions = [
  { label: "None", value: "" },
  { label: "Daily", value: "FREQ=DAILY" },
  { label: "Weekly", value: "FREQ=WEEKLY" },
  { label: "Weekdays", value: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR" },
];

export default function PlannerItemEditorScreen() {
  const params = useLocalSearchParams<{ id: string; type?: string; calendarId?: string }>();
  const router = useRouter();
  const isFocused = useIsFocused();
  const { token } = useAuth();

  const isNew = params.id === "new";
  const initialType: ItemType = params.type === "event" ? "event" : "task";

  const [item, setItem] = useState<PlannerItem | null>(null);
  const [calendars, setCalendars] = useState<PlannerCalendar[]>([]);
  const [friends, setFriends] = useState<FriendConnection[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [type, setType] = useState<ItemType>(initialType);
  const [status, setStatus] = useState<ItemStatus>("planned");
  const [priority, setPriority] = useState<ItemPriority>("important");
  const [effort, setEffort] = useState<ItemEffort>("medium");
  const [category, setCategory] = useState("");
  const [calendarId, setCalendarId] = useState<number | null>(
    params.calendarId ? Number(params.calendarId) : null
  );
  const [startInput, setStartInput] = useState(toInputDateTime(plusDays(1, 9)));
  const [endInput, setEndInput] = useState(toInputDateTime(plusDays(1, 10)));
  const [dueInput, setDueInput] = useState(toInputDateTime(plusHours(6)));
  const [selectedReminders, setSelectedReminders] = useState<number[]>([60]);
  const [recurrenceRule, setRecurrenceRule] = useState("");

  const [shareUsername, setShareUsername] = useState("");
  const [sharePermission, setSharePermission] = useState<Exclude<SharePermission, "owner">>("view");

  const loadEditorData = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      setRefreshing(true);
      setError("");

      const [calendarResponse, friendResponse, itemResponse] = await Promise.all([
        fetchCalendars(token),
        fetchFriends(token),
        isNew ? Promise.resolve(null) : fetchItem(params.id, token),
      ]);

      startTransition(() => {
        setCalendars(calendarResponse.calendars);
        setFriends(friendResponse.friends);
      });

      if (!isNew && itemResponse?.item) {
        applyItemToForm(itemResponse.item);
      } else if (calendarResponse.calendars.length && !calendarId) {
        setCalendarId(calendarResponse.calendars[0].id);
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to load item");
    } finally {
      setRefreshing(false);
    }
  }, [calendarId, isNew, params.id, token]);

  useEffect(() => {
    if (!token || !isFocused) {
      return;
    }

    loadEditorData();
  }, [token, isFocused, params.id, loadEditorData]);

  function applyItemToForm(nextItem: PlannerItem) {
    startTransition(() => {
      setItem(nextItem);
      setTitle(nextItem.title);
      setNotes(nextItem.notes);
      setType(nextItem.type);
      setStatus(nextItem.status);
      setPriority(nextItem.priority);
      setEffort(nextItem.effort);
      setCategory(nextItem.category);
      setCalendarId(nextItem.calendar_id);
      setStartInput(toInputDateTime(nextItem.start_at));
      setEndInput(toInputDateTime(nextItem.end_at));
      setDueInput(toInputDateTime(nextItem.due_at));
      setSelectedReminders(
        nextItem.reminders
          .map((reminder) => reminder.offset_minutes)
          .filter((value): value is number => typeof value === "number")
      );
      setRecurrenceRule(nextItem.recurrence_rule || "");
    });
  }

  function toggleReminder(offsetMinutes: number) {
    setSelectedReminders((current) =>
      current.includes(offsetMinutes)
        ? current.filter((value) => value !== offsetMinutes)
        : [...current, offsetMinutes]
    );
  }

  async function handleSave() {
    if (!token) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        calendarId,
        type,
        title,
        notes,
        category,
        status,
        priority,
        effort,
        startAt: startInput ? fromInputDateTime(startInput) : undefined,
        endAt: endInput ? fromInputDateTime(endInput) : undefined,
        dueAt: dueInput ? fromInputDateTime(dueInput) : undefined,
        recurrenceRule,
        reminders: selectedReminders,
      };

      if (isNew) {
        await createItem(payload, token);
      } else {
        await updateItem(params.id, payload, token);
      }

      router.back();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to save item");
    } finally {
      setSaving(false);
    }
  }

  async function handleShare() {
    if (!token || isNew) {
      return;
    }

    try {
      setSharing(true);
      setError("");
      await shareItem(params.id, shareUsername, sharePermission, token);
      startTransition(() => {
        setShareUsername("");
      });
      const response = await fetchItem(params.id, token);
      applyItemToForm(response.item);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to share item");
    } finally {
      setSharing(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            onRefresh={loadEditorData}
            refreshing={refreshing}
            tintColor={theme.colors.accent}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>{isNew ? "New item" : "Edit item"}</Text>
          <Text style={styles.title}>
            {isNew ? "Add a task or event with reminders and sharing built in." : "Adjust details without losing momentum."}
          </Text>
          <Text style={styles.subtitle}>
            Use the quick fields for capture, then add date context, reminders, recurrence, and direct sharing when it helps.
          </Text>
        </View>

        <View style={styles.panel}>
          <InputText
            label="Title"
            onChangeText={setTitle}
            placeholder="Exam prep sprint, call the bank, therapy on Tuesday..."
            value={title}
          />
          <InputText
            label="Notes"
            multiline
            onChangeText={setNotes}
            placeholder="Helpful details, links, what success looks like, or a breakdown for future-you."
            value={notes}
          />
          <InputText
            label="Category"
            onChangeText={setCategory}
            placeholder="essay, groceries, admin, routine..."
            value={category}
          />

          <View style={styles.group}>
            <Text style={styles.groupLabel}>Type</Text>
            <View style={styles.chipRow}>
              {(["task", "event"] as const).map((option) => (
                <Chip
                  key={option}
                  label={option}
                  onPress={() => setType(option)}
                  selected={type === option}
                  tone={option === "task" ? "accent" : "mint"}
                />
              ))}
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.groupLabel}>Status</Text>
            <View style={styles.chipRow}>
              {(["planned", "in_progress", "completed", "snoozed"] as const).map((option) => (
                <Chip
                  key={option}
                  label={option.replace("_", " ")}
                  onPress={() => setStatus(option)}
                  selected={status === option}
                  tone={option === "completed" ? "mint" : option === "snoozed" ? "amber" : "accent"}
                />
              ))}
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.groupLabel}>Priority</Text>
            <View style={styles.chipRow}>
              {(["urgent", "important", "normal", "easy_win"] as const).map((option) => (
                <Chip
                  key={option}
                  label={option.replace("_", " ")}
                  onPress={() => setPriority(option)}
                  selected={priority === option}
                  tone={
                    option === "urgent"
                      ? "coral"
                      : option === "important"
                        ? "accent"
                        : option === "normal"
                          ? "mint"
                          : "amber"
                  }
                />
              ))}
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.groupLabel}>Effort</Text>
            <View style={styles.chipRow}>
              {(["low", "medium", "high"] as const).map((option) => (
                <Chip
                  key={option}
                  label={option}
                  onPress={() => setEffort(option)}
                  selected={effort === option}
                  tone={option === "low" ? "mint" : option === "medium" ? "amber" : "coral"}
                />
              ))}
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.groupLabel}>Calendar</Text>
            <View style={styles.chipRow}>
              {calendars.map((calendar) => (
                <Chip
                  key={calendar.id}
                  label={calendar.title}
                  onPress={() => setCalendarId(calendar.id)}
                  selected={calendarId === calendar.id}
                  tone={calendar.is_owner ? "accent" : "amber"}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Schedule</Text>
          {type === "event" ? (
            <>
              <InputText
                autoCapitalize="none"
                label="Start"
                onChangeText={setStartInput}
                placeholder="2026-04-08 09:00"
                value={startInput}
              />
              <InputText
                autoCapitalize="none"
                label="End"
                onChangeText={setEndInput}
                placeholder="2026-04-08 10:00"
                value={endInput}
              />
            </>
          ) : (
            <InputText
              autoCapitalize="none"
              label="Due"
              onChangeText={setDueInput}
              placeholder="2026-04-08 18:00"
              value={dueInput}
            />
          )}

          <View style={styles.chipRow}>
            <Chip
              label="Today 6pm"
              onPress={() => setDueInput(toInputDateTime(plusHours(6)))}
              tone="accent"
            />
            <Chip
              label="Tomorrow 9am"
              onPress={() => {
                const tomorrowMorning = toInputDateTime(plusDays(1, 9));
                if (type === "event") {
                  setStartInput(tomorrowMorning);
                  setEndInput(toInputDateTime(plusDays(1, 10)));
                } else {
                  setDueInput(tomorrowMorning);
                }
              }}
              tone="mint"
            />
            <Chip
              label="Tomorrow 6pm"
              onPress={() => setDueInput(toInputDateTime(plusDays(1, 18)))}
              tone="amber"
            />
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Reminders and recurrence</Text>

          <View style={styles.group}>
            <Text style={styles.groupLabel}>Reminder offsets</Text>
            <View style={styles.chipRow}>
              {reminderOptions.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  onPress={() => toggleReminder(option.value)}
                  selected={selectedReminders.includes(option.value)}
                  tone={option.tone}
                />
              ))}
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.groupLabel}>Recurrence</Text>
            <View style={styles.chipRow}>
              {recurrenceOptions.map((option) => (
                <Chip
                  key={option.value || "none"}
                  label={option.label}
                  onPress={() => setRecurrenceRule(option.value)}
                  selected={recurrenceRule === option.value}
                  tone="neutral"
                />
              ))}
            </View>
          </View>
        </View>

        {!isNew ? (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Share this item</Text>
            <InputText
              autoCapitalize="none"
              label="Friend username"
              onChangeText={setShareUsername}
              placeholder="Type a friend or tap one below"
              value={shareUsername}
            />

            <View style={styles.chipRow}>
              {friends.map((friend) => (
                <Chip
                  key={friend.id}
                  label={friend.username}
                  onPress={() => setShareUsername(friend.username)}
                  selected={shareUsername === friend.username}
                  tone="mint"
                />
              ))}
            </View>

            <View style={styles.chipRow}>
              {(["view", "edit"] as const).map((option) => (
                <Chip
                  key={option}
                  label={option === "view" ? "View only" : "Can edit"}
                  onPress={() => setSharePermission(option)}
                  selected={sharePermission === option}
                  tone={option === "view" ? "accent" : "coral"}
                />
              ))}
            </View>

            <Button
              disabled={!shareUsername.trim()}
              loading={sharing}
              onPress={handleShare}
              title="Share this item"
              variant="secondary"
            />

            {item?.shares.length ? (
              <View style={styles.shareList}>
                {item.shares.map((share) => (
                  <View key={share.id} style={styles.shareRow}>
                    <Text style={styles.shareName}>{share.username}</Text>
                    <Text style={styles.shareMeta}>{share.permission}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.footer}>
          <Button loading={saving} onPress={handleSave} title={isNew ? "Create item" : "Save changes"} />
          <Button onPress={() => router.back()} title="Cancel" variant="secondary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 20,
    gap: 18,
    paddingBottom: 36,
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 30,
    padding: 22,
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  eyebrow: {
    color: theme.colors.accent,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 36,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  panel: {
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 20,
    gap: 16,
  },
  panelTitle: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: "800",
  },
  group: {
    gap: 10,
  },
  groupLabel: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  shareList: {
    gap: 10,
  },
  shareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  shareName: {
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  shareMeta: {
    color: theme.colors.textSecondary,
    textTransform: "capitalize",
  },
  footer: {
    gap: 12,
    paddingBottom: 24,
  },
  errorText: {
    color: theme.colors.coral,
    fontWeight: "700",
  },
});
