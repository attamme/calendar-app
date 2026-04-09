import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { startTransition, useCallback, useEffect, useRef, useState } from "react";
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
import TopBar from "@/components/TopBar";
import { useAuth } from "@/providers/AuthProvider";
import { usePlannerSync } from "@/providers/PlannerSyncProvider";
import {
  createItem,
  fetchCalendars,
  fetchFriends,
  fetchItem,
  setMySharedItemCalendar,
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
import { fromInputDateTime, nextOccurrenceAt, todayAt, tomorrowAt, toInputDateTime } from "@/utils/dates";

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

function readParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export default function PlannerItemEditorScreen() {
  const params = useLocalSearchParams<{
    id: string;
    type?: string;
    calendarId?: string;
    dueAt?: string;
    startAt?: string;
    endAt?: string;
  }>();
  const router = useRouter();
  const isFocused = useIsFocused();
  const { token } = useAuth();
  const { notifyPlannerChanged } = usePlannerSync();

  const itemId = readParam(params.id);
  const typeParam = readParam(params.type);
  const calendarIdParam = readParam(params.calendarId);
  const dueAtParam = readParam(params.dueAt);
  const startAtParam = readParam(params.startAt);
  const endAtParam = readParam(params.endAt);

  const isNew = itemId === "new";
  const initialType: ItemType = typeParam === "event" ? "event" : "task";
  const initialDueInput = toInputDateTime(dueAtParam || nextOccurrenceAt(18));
  const initialStartInput = toInputDateTime(startAtParam || tomorrowAt(9));
  const initialEndInput = toInputDateTime(endAtParam || tomorrowAt(10));

  const [item, setItem] = useState<PlannerItem | null>(null);
  const [calendars, setCalendars] = useState<PlannerCalendar[]>([]);
  const [friends, setFriends] = useState<FriendConnection[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState("");
  const loadRequestRef = useRef(0);

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [type, setType] = useState<ItemType>(initialType);
  const [status, setStatus] = useState<ItemStatus>("planned");
  const [priority, setPriority] = useState<ItemPriority>("important");
  const [effort, setEffort] = useState<ItemEffort>("medium");
  const [category, setCategory] = useState("");
  const [calendarId, setCalendarId] = useState<number | null>(
    calendarIdParam ? Number(calendarIdParam) : null
  );
  const [myShareCalendarId, setMyShareCalendarId] = useState<number | null>(null);
  const [startInput, setStartInput] = useState(initialStartInput);
  const [endInput, setEndInput] = useState(initialEndInput);
  const [dueInput, setDueInput] = useState(initialDueInput);
  const [selectedReminders, setSelectedReminders] = useState<number[]>([60]);
  const [recurrenceRule, setRecurrenceRule] = useState("");

  const [shareUsername, setShareUsername] = useState("");
  const [sharePermission, setSharePermission] = useState<Exclude<SharePermission, "owner">>("view");
  const [assigningCalendar, setAssigningCalendar] = useState(false);

  const loadEditorData = useCallback(async () => {
    if (!token) {
      return;
    }

    const requestId = loadRequestRef.current + 1;
    loadRequestRef.current = requestId;

    try {
      setRefreshing(true);
      setError("");

      const [calendarResponse, friendResponse, itemResponse] = await Promise.all([
        fetchCalendars(token),
        fetchFriends(token),
        isNew ? Promise.resolve(null) : fetchItem(itemId, token),
      ]);

      if (requestId !== loadRequestRef.current) {
        return;
      }

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
      if (requestId !== loadRequestRef.current) {
        return;
      }

      setError(caughtError instanceof Error ? caughtError.message : "Failed to load item");
    } finally {
      if (requestId === loadRequestRef.current) {
        setRefreshing(false);
      }
    }
  }, [calendarId, isNew, itemId, token]);

  useEffect(() => {
    if (!token || !isFocused) {
      return;
    }

    loadEditorData();
  }, [token, isFocused, itemId, loadEditorData]);

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
      setMyShareCalendarId(nextItem.share_calendar_id || null);
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

  function applySchedulePreset(dayOffset: number, hour: number) {
    const anchor = dayOffset === 0 ? todayAt(hour) : tomorrowAt(hour);

    if (type === "event") {
      const endAnchor = dayOffset === 0 ? todayAt(hour + 1) : tomorrowAt(hour + 1);
      setStartInput(toInputDateTime(anchor));
      setEndInput(toInputDateTime(endAnchor));
      return;
    }

    setDueInput(toInputDateTime(anchor));
  }

  function exitEditor() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(app)/dashboard");
  }

  async function handleSave(overrides?: { status?: ItemStatus }) {
    if (!token) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const nextStatus = overrides?.status || status;
      const canEditSourceCalendar = isNew || item?.is_owner || !item?.is_direct_share;
      const payload = {
        calendarId: canEditSourceCalendar ? calendarId : undefined,
        type,
        title,
        notes,
        category,
        status: nextStatus,
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
        await updateItem(itemId, payload, token);
      }

      notifyPlannerChanged();
      exitEditor();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to save item");
    } finally {
      setSaving(false);
    }
  }

  async function handleComplete() {
    await handleSave({ status: "completed" });
  }

  async function handleAssignMyCalendar(nextCalendarId: number | null) {
    if (!token || isNew) {
      return;
    }

    try {
      setAssigningCalendar(true);
      setError("");
      const response = await setMySharedItemCalendar(itemId, nextCalendarId, token);
      applyItemToForm(response.item);
      notifyPlannerChanged();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to place this shared item into your calendar"
      );
    } finally {
      setAssigningCalendar(false);
    }
  }

  async function handleShare() {
    if (!token || isNew) {
      return;
    }

    try {
      setSharing(true);
      setError("");
      await shareItem(itemId, shareUsername, sharePermission, token);
      startTransition(() => {
        setShareUsername("");
      });
      const response = await fetchItem(itemId, token);
      applyItemToForm(response.item);
      notifyPlannerChanged();
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
        <TopBar
          actionDisabled={saving || !title.trim()}
          actionLabel={saving ? "Saving..." : "Save"}
          onAction={() => handleSave()}
          onBack={exitEditor}
          subtitle={
            item?.is_direct_share && !item.is_owner
              ? "Shared items can live in your own calendar without moving the original."
              : type === "event"
                ? "Keep the event details lightweight, visible, and easy to adjust."
                : "Quick details first. Everything else can stay optional."
          }
          title={isNew ? "New reminder" : "Edit reminder"}
          tone="figma"
        />

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Info</Text>
          <InputText
            hideLabel
            onChangeText={setTitle}
            placeholder="Title"
            value={title}
            variant="figma"
          />
          <InputText
            hideLabel
            multiline
            onChangeText={setNotes}
            placeholder="Notes"
            value={notes}
            variant="figma"
          />
          <InputText
            hideLabel
            onChangeText={setCategory}
            placeholder="Category"
            value={category}
            variant="figma"
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

          {item?.is_direct_share && !item.is_owner ? (
            <View style={styles.group}>
              <Text style={styles.groupLabel}>Shared item placement</Text>
              <Text style={styles.helperText}>
                Source calendar: {item.source_calendar_title || "Shared directly"}.
                Choose where this appears for you without moving it for everyone else.
              </Text>
              <View style={styles.chipRow}>
                <Chip
                  label={item.source_calendar_title ? "Original calendar" : "Keep separate"}
                  onPress={() => handleAssignMyCalendar(null)}
                  selected={myShareCalendarId === null}
                  tone="neutral"
                />
                {calendars.map((calendar) => (
                  <Chip
                    key={calendar.id}
                    label={calendar.title}
                    onPress={() => handleAssignMyCalendar(calendar.id)}
                    selected={myShareCalendarId === calendar.id}
                    tone={calendar.is_owner ? "accent" : "amber"}
                  />
                ))}
              </View>
              {assigningCalendar ? <Text style={styles.helperText}>Saving your placement...</Text> : null}
            </View>
          ) : (
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
          )}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Date & Time</Text>
          <Text style={styles.panelText}>
            {type === "event"
              ? "Set the window people should see on the calendar."
              : "Use a simple due moment so today and tomorrow stay accurate."}
          </Text>
          {type === "event" ? (
            <>
              <InputText
                autoCapitalize="none"
                hideLabel
                onChangeText={setStartInput}
                placeholder="Start"
                value={startInput}
                variant="figma"
              />
              <InputText
                autoCapitalize="none"
                hideLabel
                onChangeText={setEndInput}
                placeholder="End"
                value={endInput}
                variant="figma"
              />
            </>
          ) : (
            <InputText
              autoCapitalize="none"
              hideLabel
              onChangeText={setDueInput}
              placeholder="Due date and time"
              value={dueInput}
              variant="figma"
            />
          )}

          <View style={styles.chipRow}>
            <Chip
              label="Today 6pm"
              onPress={() => applySchedulePreset(0, 18)}
              tone="accent"
            />
            <Chip
              label="Tomorrow 9am"
              onPress={() => applySchedulePreset(1, 9)}
              tone="mint"
            />
            <Chip
              label="Tomorrow 6pm"
              onPress={() => applySchedulePreset(1, 18)}
              tone="amber"
            />
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Extra</Text>
          <Text style={styles.panelText}>
            Keep reminders and repeats light. You can always add more later.
          </Text>

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
            <Text style={styles.panelTitle}>People</Text>
            <Text style={styles.panelText}>
              Share the item with one friend, then let each person place it into the calendar that fits them.
            </Text>
            <InputText
              autoCapitalize="none"
              hideLabel
              onChangeText={setShareUsername}
              placeholder="Friend username or email"
              value={shareUsername}
              variant="figma"
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
          {!isNew && status !== "completed" ? (
            <Button
              loading={saving}
              onPress={handleComplete}
              style={styles.completeButton}
              textStyle={styles.completeButtonText}
              title="Mark complete"
              variant="secondary"
            />
          ) : null}
          <Button
            loading={saving}
            onPress={() => handleSave()}
            style={styles.saveButton}
            title={isNew ? "Create item" : "Save changes"}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.figmaMain,
  },
  content: {
    padding: 20,
    gap: 18,
    paddingBottom: 36,
  },
  panel: {
    backgroundColor: theme.colors.figmaSurface,
    borderRadius: 28,
    padding: 18,
    gap: 14,
  },
  panelTitle: {
    color: theme.colors.figmaText,
    fontSize: 22,
    fontWeight: "700",
  },
  panelText: {
    color: theme.colors.figmaSubtext,
    lineHeight: 21,
  },
  group: {
    gap: 10,
  },
  groupLabel: {
    color: theme.colors.figmaSubtext,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  helperText: {
    color: theme.colors.figmaSubtext,
    lineHeight: 20,
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
    borderBottomColor: theme.colors.figmaSurfaceAlt,
  },
  shareName: {
    color: theme.colors.figmaText,
    fontWeight: "700",
  },
  shareMeta: {
    color: theme.colors.figmaSubtext,
    textTransform: "capitalize",
  },
  footer: {
    gap: 12,
    paddingBottom: 24,
  },
  saveButton: {
    backgroundColor: theme.colors.figmaAccent,
    borderColor: theme.colors.figmaAccent,
  },
  completeButton: {
    backgroundColor: theme.colors.figmaSurface,
    borderColor: theme.colors.figmaSurface,
  },
  completeButtonText: {
    color: theme.colors.figmaText,
  },
  errorText: {
    color: "#FFB4B4",
    fontWeight: "700",
  },
});
