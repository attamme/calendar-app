import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { startTransition, useCallback, useState } from "react";
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
import HiFiHeader from "@/components/HiFiHeader";
import InputText from "@/components/InputText";
import { useAuth } from "@/providers/AuthProvider";
import { usePlannerSync } from "@/providers/PlannerSyncProvider";
import { createItem, fetchCalendars } from "@/services/api";
import { theme } from "@/theme/tokens";
import type { ItemEffort, ItemPriority, ItemType, PlannerCalendar } from "@/types/planner";
import { nextOccurrenceAt, tomorrowAt } from "@/utils/dates";

const reminderOptions = [
  { label: "10m", value: 10, tone: "coral" as const },
  { label: "1h", value: 60, tone: "accent" as const },
  { label: "2h", value: 120, tone: "mint" as const },
  { label: "1d", value: 1440, tone: "amber" as const },
];

const priorityOptions: { label: string; value: ItemPriority; tone: "coral" | "accent" | "mint" | "amber" }[] = [
  { label: "Urgent", value: "urgent", tone: "coral" },
  { label: "Important", value: "important", tone: "accent" },
  { label: "Normal", value: "normal", tone: "mint" },
  { label: "Easy win", value: "easy_win", tone: "amber" },
];

const effortOptions: { label: string; value: ItemEffort; tone: "mint" | "amber" | "coral" }[] = [
  { label: "Low effort", value: "low", tone: "mint" },
  { label: "Medium", value: "medium", tone: "amber" },
  { label: "Deep work", value: "high", tone: "coral" },
];

export default function QuickCaptureScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { notifyPlannerChanged } = usePlannerSync();

  const [calendars, setCalendars] = useState<PlannerCalendar[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [type, setType] = useState<ItemType>("task");
  const [priority, setPriority] = useState<ItemPriority>("important");
  const [effort, setEffort] = useState<ItemEffort>("medium");
  const [selectedCalendarId, setSelectedCalendarId] = useState<number | null>(null);
  const [selectedReminders, setSelectedReminders] = useState<number[]>([60]);

  const loadCalendars = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      setRefreshing(true);
      setError("");
      const response = await fetchCalendars(token);
      startTransition(() => {
        setCalendars(response.calendars);
        setSelectedCalendarId((current) => current || response.calendars[0]?.id || null);
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to load calendars");
    } finally {
      setRefreshing(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadCalendars();
    }, [loadCalendars])
  );

  function toggleReminder(offsetMinutes: number) {
    setSelectedReminders((current) =>
      current.includes(offsetMinutes)
        ? current.filter((value) => value !== offsetMinutes)
        : [...current, offsetMinutes]
    );
  }

  function exitScreen() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(app)/dashboard");
  }

  async function handleCreate() {
    if (!token) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      await createItem(
        {
          title: title.trim(),
          type,
          priority,
          effort,
          calendarId: selectedCalendarId,
          dueAt: type === "task" ? nextOccurrenceAt(18) : undefined,
          startAt: type === "event" ? tomorrowAt(9) : undefined,
          endAt: type === "event" ? tomorrowAt(10) : undefined,
          reminders: selectedReminders,
        },
        token
      );

      notifyPlannerChanged();
      exitScreen();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Quick capture failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            onRefresh={loadCalendars}
            refreshing={refreshing}
            tintColor={theme.colors.accentHigh}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <HiFiHeader
          leftIcon="chevron-left"
          onLeftPress={exitScreen}
          title="Quick capture"
        />

        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Fast entry</Text>
          <Text style={styles.heroTitle}>Add it before it disappears.</Text>
          <Text style={styles.heroText}>
            Keep this page short and decisive. Full editing can still happen later.
          </Text>
        </View>

        <View style={styles.panel}>
          <InputText
            label="What needs attention?"
            onChangeText={setTitle}
            placeholder="Essay outline, meds refill, project check-in..."
            value={title}
          />

          <View style={styles.group}>
            <Text style={styles.groupLabel}>Type</Text>
            <View style={styles.chipRow}>
              {(["task", "event"] as const).map((option) => (
                <Chip
                  key={option}
                  label={option === "task" ? "Task" : "Event"}
                  onPress={() => setType(option)}
                  selected={type === option}
                  tone={option === "task" ? "accent" : "mint"}
                />
              ))}
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.groupLabel}>Priority</Text>
            <View style={styles.chipRow}>
              {priorityOptions.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  onPress={() => setPriority(option.value)}
                  selected={priority === option.value}
                  tone={option.tone}
                />
              ))}
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.groupLabel}>Effort</Text>
            <View style={styles.chipRow}>
              {effortOptions.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  onPress={() => setEffort(option.value)}
                  selected={effort === option.value}
                  tone={option.tone}
                />
              ))}
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.groupLabel}>Calendar</Text>
            <View style={styles.chipRow}>
              {calendars.length ? (
                calendars.map((calendar) => (
                  <Chip
                    key={calendar.id}
                    label={calendar.title}
                    onPress={() => setSelectedCalendarId(calendar.id)}
                    selected={selectedCalendarId === calendar.id}
                    tone={calendar.is_owner ? "accent" : "amber"}
                  />
                ))
              ) : (
                <Chip label="No calendar yet" selected tone="neutral" />
              )}
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.groupLabel}>Reminder plan</Text>
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

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.actions}>
            <Button
              disabled={!title.trim()}
              loading={saving}
              onPress={handleCreate}
              style={styles.actionButton}
              title={type === "task" ? "Add task" : "Add event"}
            />
            <Button
              onPress={() =>
                router.push({
                  pathname: "/planner-item/[id]",
                  params: {
                    id: "new",
                    type,
                    ...(selectedCalendarId ? { calendarId: String(selectedCalendarId) } : {}),
                  },
                })
              }
              style={styles.actionButton}
              title="Open full editor"
              variant="secondary"
            />
          </View>
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
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 20,
    gap: 8,
  },
  heroEyebrow: {
    color: theme.colors.accentHigh,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: theme.colors.textPrimary,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },
  heroText: {
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  panel: {
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 20,
    gap: 18,
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
  actions: {
    gap: 10,
  },
  actionButton: {
    width: "100%",
  },
  errorText: {
    color: theme.colors.coralHigh,
    fontWeight: "700",
    lineHeight: 20,
  },
});
