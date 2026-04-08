import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
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
import MetricCard from "@/components/MetricCard";
import PlannerCard from "@/components/PlannerCard";
import { useAuth } from "@/providers/AuthProvider";
import { createItem, fetchCalendars, fetchDashboard } from "@/services/api";
import { theme } from "@/theme/tokens";
import type {
  ItemEffort,
  ItemPriority,
  ItemType,
  PlannerCalendar,
  PlannerDashboard,
} from "@/types/planner";
import { plusDays, plusHours } from "@/utils/dates";

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

export default function DashboardScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { token, user } = useAuth();

  const [dashboard, setDashboard] = useState<PlannerDashboard | null>(null);
  const [calendars, setCalendars] = useState<PlannerCalendar[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [quickTitle, setQuickTitle] = useState("");
  const [quickType, setQuickType] = useState<ItemType>("task");
  const [quickPriority, setQuickPriority] = useState<ItemPriority>("important");
  const [quickEffort, setQuickEffort] = useState<ItemEffort>("medium");
  const [selectedCalendarId, setSelectedCalendarId] = useState<number | null>(null);
  const [selectedReminders, setSelectedReminders] = useState<number[]>([60]);

  const loadScreenData = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      setError("");
      setRefreshing(true);

      const [dashboardResponse, calendarResponse] = await Promise.all([
        fetchDashboard(token),
        fetchCalendars(token),
      ]);

      startTransition(() => {
        setDashboard(dashboardResponse);
        setCalendars(calendarResponse.calendars);
        setSelectedCalendarId((current) => current || calendarResponse.calendars[0]?.id || null);
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to load dashboard");
    } finally {
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token || !isFocused) {
      return;
    }

    loadScreenData();
  }, [token, isFocused, loadScreenData]);

  function toggleReminder(offsetMinutes: number) {
    setSelectedReminders((current) =>
      current.includes(offsetMinutes)
        ? current.filter((value) => value !== offsetMinutes)
        : [...current, offsetMinutes]
    );
  }

  async function handleQuickCreate() {
    if (!token) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createItem(
        {
          title: quickTitle,
          type: quickType,
          priority: quickPriority,
          effort: quickEffort,
          calendarId: selectedCalendarId,
          dueAt: quickType === "task" ? plusHours(6) : plusDays(1, 9),
          startAt: quickType === "event" ? plusDays(1, 9) : undefined,
          endAt: quickType === "event" ? plusDays(1, 10) : undefined,
          reminders: selectedReminders,
        },
        token
      );

      startTransition(() => {
        setQuickTitle("");
        setQuickPriority("important");
        setQuickEffort("medium");
        setSelectedReminders([60]);
      });

      await loadScreenData();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Quick add failed");
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
            onRefresh={loadScreenData}
            refreshing={refreshing}
            tintColor={theme.colors.accent}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Daily focus</Text>
          <Text style={styles.title}>Hi {user?.username || "there"}, what needs your attention next?</Text>
          <Text style={styles.subtitle}>
            Capture a task quickly, then use smart groups to work through today, next up, overdue, and easy wins without losing context.
          </Text>
          <View style={styles.metricRow}>
            <MetricCard
              label="Today"
              tone="accent"
              value={dashboard?.summary.todayCount || 0}
            />
            <MetricCard
              label="Overdue"
              tone="coral"
              value={dashboard?.summary.overdueCount || 0}
            />
            <MetricCard
              label="Easy wins"
              tone="mint"
              value={dashboard?.summary.easyWinCount || 0}
            />
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Quick capture</Text>
            <Button
              onPress={() =>
                router.push({
                  pathname: "/planner-item/new",
                  params: {
                    type: quickType,
                    calendarId: selectedCalendarId ? String(selectedCalendarId) : "",
                  },
                })
              }
              style={styles.inlineButton}
              title="Open full editor"
              variant="secondary"
            />
          </View>

          <InputText
            label="What do you need to remember?"
            onChangeText={setQuickTitle}
            placeholder="Essay outline, therapy homework, food shop, call Alex..."
            value={quickTitle}
          />

          <View style={styles.group}>
            <Text style={styles.groupLabel}>Type</Text>
            <View style={styles.chipRow}>
              {(["task", "event"] as const).map((typeValue) => (
                <Chip
                  key={typeValue}
                  label={typeValue === "task" ? "Task" : "Event"}
                  onPress={() => setQuickType(typeValue)}
                  selected={quickType === typeValue}
                  tone={typeValue === "task" ? "accent" : "mint"}
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
                  onPress={() => setQuickPriority(option.value)}
                  selected={quickPriority === option.value}
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
                  onPress={() => setQuickEffort(option.value)}
                  selected={quickEffort === option.value}
                  tone={option.tone}
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
                  onPress={() => setSelectedCalendarId(calendar.id)}
                  selected={selectedCalendarId === calendar.id}
                  tone={calendar.is_owner ? "accent" : "amber"}
                />
              ))}
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

          <Button
            disabled={!quickTitle.trim()}
            loading={saving}
            onPress={handleQuickCreate}
            title={quickType === "task" ? "Add task" : "Add event"}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today</Text>
          <Text style={styles.sectionSubtitle}>
            Things already calling for your attention.
          </Text>
          <View style={styles.cardStack}>
            {dashboard?.sections.today.length ? (
              dashboard.sections.today.map((item) => (
                <PlannerCard
                  item={item}
                  key={item.id}
                  onPress={() => router.push(`/planner-item/${item.id}`)}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>Nothing urgent today. Good place to slot one small win.</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next up</Text>
          <Text style={styles.sectionSubtitle}>
            The next 72 hours, sorted to keep the momentum going.
          </Text>
          <View style={styles.cardStack}>
            {dashboard?.sections.nextUp.length ? (
              dashboard.sections.nextUp.map((item) => (
                <PlannerCard
                  item={item}
                  key={item.id}
                  onPress={() => router.push(`/planner-item/${item.id}`)}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>Your near-term queue is clear right now.</Text>
            )}
          </View>
        </View>

        <View style={styles.doubleSection}>
          <View style={styles.miniSection}>
            <Text style={styles.sectionTitle}>Overdue</Text>
            <View style={styles.cardStack}>
              {dashboard?.sections.overdue.length ? (
                dashboard.sections.overdue.slice(0, 2).map((item) => (
                  <PlannerCard
                    item={item}
                    key={item.id}
                    onPress={() => router.push(`/planner-item/${item.id}`)}
                  />
                ))
              ) : (
                <Text style={styles.emptyText}>No overdue items.</Text>
              )}
            </View>
          </View>

          <View style={styles.miniSection}>
            <Text style={styles.sectionTitle}>Easy wins</Text>
            <View style={styles.cardStack}>
              {dashboard?.sections.easyWins.length ? (
                dashboard.sections.easyWins.slice(0, 2).map((item) => (
                  <PlannerCard
                    item={item}
                    key={item.id}
                    onPress={() => router.push(`/planner-item/${item.id}`)}
                  />
                ))
              ) : (
                <Text style={styles.emptyText}>Add a couple of low-effort wins for rough days.</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shared with you</Text>
          <Text style={styles.sectionSubtitle}>
            Group projects, friend plans, and accountability items in one lane.
          </Text>
          <View style={styles.cardStack}>
            {dashboard?.sections.shared.length ? (
              dashboard.sections.shared.map((item) => (
                <PlannerCard
                  item={item}
                  key={item.id}
                  onPress={() => router.push(`/planner-item/${item.id}`)}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>Nothing shared yet. Your friends tab is ready for it.</Text>
            )}
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
    borderRadius: 30,
    padding: 22,
    gap: 14,
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
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 38,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  metricRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  panel: {
    backgroundColor: theme.colors.surfaceWarm,
    borderRadius: 28,
    padding: 20,
    gap: 18,
  },
  panelHeader: {
    gap: 10,
  },
  panelTitle: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: "800",
  },
  inlineButton: {
    alignSelf: "flex-start",
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
  section: {
    gap: 10,
  },
  doubleSection: {
    gap: 18,
  },
  miniSection: {
    gap: 10,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: "800",
  },
  sectionSubtitle: {
    color: theme.colors.textSecondary,
    lineHeight: 21,
  },
  cardStack: {
    gap: 12,
  },
  emptyText: {
    color: theme.colors.textMuted,
    lineHeight: 20,
  },
  errorText: {
    color: theme.colors.coral,
    fontWeight: "700",
  },
});
