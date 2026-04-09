import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
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
import AnimatedScreenSection from "@/components/AnimatedScreenSection";
import FeaturedPlannerCard from "@/components/FeaturedPlannerCard";
import FocusBucketCard from "@/components/FocusBucketCard";
import HiFiHeader from "@/components/HiFiHeader";
import PlannerCard from "@/components/PlannerCard";
import { useAuth } from "@/providers/AuthProvider";
import { usePlannerSync } from "@/providers/PlannerSyncProvider";
import { fetchCalendars, fetchDashboard } from "@/services/api";
import { theme } from "@/theme/tokens";
import type {
  ItemType,
  PlannerCalendar,
  PlannerDashboard,
  PlannerItem,
} from "@/types/planner";

function buildNewItemParams(type: ItemType, calendarId: number | null) {
  return {
    id: "new",
    type,
    ...(calendarId ? { calendarId: String(calendarId) } : {}),
  };
}

export default function DashboardScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { refreshVersion } = usePlannerSync();

  const [dashboard, setDashboard] = useState<PlannerDashboard | null>(null);
  const [calendars, setCalendars] = useState<PlannerCalendar[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const loadRequestRef = useRef(0);

  const [selectedCalendarId, setSelectedCalendarId] = useState<number | null>(null);

  const liveQueue = dashboard?.sections.today.length
    ? dashboard.sections.today
    : dashboard?.sections.nextUp || [];
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredItem = liveQueue[featuredIndex] || null;
  const upcomingFeaturedItems = liveQueue.slice(featuredIndex + 1, featuredIndex + 6);

  const openNewItem = useCallback(
    (type: ItemType) => {
      router.push({
        pathname: "/planner-item/[id]",
        params: buildNewItemParams(type, selectedCalendarId),
      });
    },
    [router, selectedCalendarId]
  );

  const openItem = useCallback(
    (item: PlannerItem) => {
      router.push(`/planner-item/${item.id}`);
    },
    [router]
  );

  const loadScreenData = useCallback(async () => {
    if (!token) {
      return;
    }

    const requestId = loadRequestRef.current + 1;
    loadRequestRef.current = requestId;

    try {
      setError("");
      setRefreshing(true);

      const [dashboardResponse, calendarResponse] = await Promise.all([
        fetchDashboard(token),
        fetchCalendars(token),
      ]);

      if (requestId !== loadRequestRef.current) {
        return;
      }

      startTransition(() => {
        setDashboard(dashboardResponse);
        setCalendars(calendarResponse.calendars);
        setSelectedCalendarId((current) => current || calendarResponse.calendars[0]?.id || null);
        setFeaturedIndex((current) => {
          if (!dashboardResponse.sections.today.length && !dashboardResponse.sections.nextUp.length) {
            return 0;
          }

          const nextQueue = dashboardResponse.sections.today.length
            ? dashboardResponse.sections.today
            : dashboardResponse.sections.nextUp;

          return Math.min(current, Math.max(nextQueue.length - 1, 0));
        });
      });
    } catch (caughtError) {
      if (requestId !== loadRequestRef.current) {
        return;
      }

      setError(caughtError instanceof Error ? caughtError.message : "Failed to load dashboard");
    } finally {
      if (requestId === loadRequestRef.current) {
        setRefreshing(false);
      }
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      if (!token) {
        return undefined;
      }

      loadScreenData();
      const refreshId = setInterval(() => {
        loadScreenData();
      }, 30000);

      return () => clearInterval(refreshId);
    }, [loadScreenData, token])
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    loadScreenData();
  }, [loadScreenData, refreshVersion, token]);

  const todayItems = dashboard?.sections.today || [];
  const overdueItems = dashboard?.sections.overdue || [];
  const easyWinItems = dashboard?.sections.easyWins || [];
  const nextUpItems = dashboard?.sections.nextUp || [];
  const sharedItems = dashboard?.sections.shared || [];
  const activeCalendars = calendars.slice(0, 3);
  const ownerCalendarCount = calendars.filter((calendar) => calendar.is_owner).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View pointerEvents="none" style={styles.glowA} />
      <View pointerEvents="none" style={styles.glowB} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            onRefresh={loadScreenData}
            refreshing={refreshing}
            tintColor={theme.colors.accentHigh}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <AnimatedScreenSection delay={0}>
          <HiFiHeader
            leftIcon="menu"
            onLeftPress={() => router.push("/(app)/friends")}
            rightIcon="calendar-month-outline"
            onRightPress={() => router.push("/(app)/calendars")}
            title="My calendar"
          />
        </AnimatedScreenSection>

        <AnimatedScreenSection delay={40} style={styles.heroSection}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>Daily focus</Text>
            <Text style={styles.heroTitle}>
              {featuredItem ? "Keep one thing moving at a time." : "Start with one clear next step."}
            </Text>
            <Text style={styles.heroText}>
              {featuredItem
                ? "Your current focus stays at the top so the rest of the plan feels lighter."
                : "Add a task or event and the focus queue will surface the next best thing to do."}
            </Text>
          </View>

          <FeaturedPlannerCard
            emptyDescription="Capture the next task or event and it will show up here with room to review details."
            emptyTitle="Nothing selected yet"
            item={featuredItem}
            onDetailsPress={featuredItem ? () => openItem(featuredItem) : () => openNewItem("task")}
            onNext={featuredIndex < liveQueue.length - 1 ? () => setFeaturedIndex((current) => current + 1) : undefined}
            onPress={featuredItem ? () => openItem(featuredItem) : () => openNewItem("task")}
            onPrev={featuredIndex > 0 ? () => setFeaturedIndex((current) => current - 1) : undefined}
            queueLabel={liveQueue.length > 1 ? `${featuredIndex + 1} of ${liveQueue.length}` : undefined}
            statusLabel={featuredItem?.status === "completed" ? "Finished" : undefined}
            upcomingItems={upcomingFeaturedItems}
          />

          <View style={styles.primaryActions}>
            <Button
              onPress={() => openNewItem("task")}
              style={styles.primaryActionButton}
              textStyle={styles.primaryActionText}
              title="New task"
            />
            <Button
              onPress={() => openNewItem("event")}
              style={styles.primaryActionButton}
              textStyle={styles.primaryActionText}
              title="New event"
              variant="secondary"
            />
            <Button
              onPress={() => router.push("/(app)/calendars")}
              style={styles.primaryActionButton}
              textStyle={styles.primaryActionText}
              title="Open calendar"
              variant="ghost"
            />
          </View>
        </AnimatedScreenSection>

        <AnimatedScreenSection delay={90} style={styles.bucketGrid}>
          <FocusBucketCard
            count={dashboard?.summary.todayCount || 0}
            items={todayItems}
            onPress={todayItems[0] ? () => openItem(todayItems[0]) : () => openNewItem("task")}
            subtitle="Tasks and events that already belong to today."
            title="Today"
            tone="accent"
          />
          <FocusBucketCard
            count={dashboard?.summary.overdueCount || 0}
            items={overdueItems}
            onPress={overdueItems[0] ? () => openItem(overdueItems[0]) : () => openNewItem("task")}
            subtitle="Things that need a reset before they keep piling up."
            title="Overdue"
            tone="coral"
          />
          <FocusBucketCard
            count={dashboard?.summary.easyWinCount || 0}
            items={easyWinItems}
            onPress={easyWinItems[0] ? () => openItem(easyWinItems[0]) : () => openNewItem("task")}
            subtitle="Low-effort wins for rough attention days."
            title="Easy wins"
            tone="mint"
          />
        </AnimatedScreenSection>

        <AnimatedScreenSection delay={140} style={styles.capturePanel}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionCopy}>
              <Text style={styles.sectionEyebrow}>Planning hub</Text>
              <Text style={styles.sectionTitle}>Keep heavy actions on their own pages.</Text>
            </View>
            <Text style={styles.sectionHint}>{calendars.length} calendars connected</Text>
          </View>

          <Text style={styles.managementText}>
            Quick capture, calendar setup, and friend connections now live on dedicated pages so this screen can stay focused on what matters now.
          </Text>

          <View style={styles.managementStack}>
            <View style={styles.managementCard}>
              <Text style={styles.managementCardEyebrow}>Capture</Text>
              <Text style={styles.managementCardTitle}>Open a short add screen</Text>
              <Text style={styles.managementCardText}>
                Best for dropping in one task or event without carrying the full editor on this page.
              </Text>
              <Button
                onPress={() => router.push("/(app)/quick-capture")}
                title="Quick capture"
              />
            </View>

            <View style={styles.managementCard}>
              <Text style={styles.managementCardEyebrow}>Calendars</Text>
              <Text style={styles.managementCardTitle}>Manage structure elsewhere</Text>
              <Text style={styles.managementCardText}>
                Create calendars, review ownership, and share them without crowding the month view.
              </Text>
              <Button
                onPress={() => router.push("/(app)/calendar-center")}
                title="Calendar center"
                variant="secondary"
              />
            </View>

            <View style={styles.managementCard}>
              <Text style={styles.managementCardEyebrow}>Sharing</Text>
              <Text style={styles.managementCardTitle}>Add friends from a dedicated flow</Text>
              <Text style={styles.managementCardText}>
                Keep invites and shared planning together, then come back here to focus on the work.
              </Text>
              <Button
                onPress={() => router.push("/(app)/friend-search")}
                title="Add friend"
                variant="ghost"
              />
            </View>
          </View>

          <View style={styles.metricStrip}>
            <View style={styles.metricTile}>
              <Text style={styles.metricValue}>{ownerCalendarCount}</Text>
              <Text style={styles.metricLabel}>Owned calendars</Text>
            </View>
            <View style={styles.metricTile}>
              <Text style={styles.metricValue}>{sharedItems.length}</Text>
              <Text style={styles.metricLabel}>Shared items</Text>
            </View>
            <View style={styles.metricTile}>
              <Text style={styles.metricValue}>{dashboard?.summary.nextUpCount || 0}</Text>
              <Text style={styles.metricLabel}>Next up</Text>
            </View>
          </View>

          <Text style={styles.calendarPreviewText}>
            {activeCalendars.length
              ? `Recent calendars: ${activeCalendars.map((calendar) => calendar.title).join(" | ")}`
              : "Create your first calendar from Calendar center."}
          </Text>
        </AnimatedScreenSection>

        <AnimatedScreenSection delay={190} style={styles.sectionShell}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionCopy}>
              <Text style={styles.sectionEyebrow}>Queue</Text>
              <Text style={styles.sectionTitle}>Today and next up</Text>
            </View>
            <Text style={styles.sectionHint}>
              {(dashboard?.summary.todayCount || 0) + (dashboard?.summary.nextUpCount || 0)} active items
            </Text>
          </View>

          <View style={styles.cardStack}>
            {todayItems.length ? todayItems.map((item) => (
              <PlannerCard
                item={item}
                key={`today-${item.id}`}
                onPress={() => openItem(item)}
              />
            )) : (
              <Text style={styles.emptyText}>Nothing urgent today. Good time to add one clear win.</Text>
            )}

            {nextUpItems.length ? nextUpItems.map((item) => (
              <PlannerCard
                item={item}
                key={`next-${item.id}`}
                onPress={() => openItem(item)}
              />
            )) : null}
          </View>
        </AnimatedScreenSection>

        <AnimatedScreenSection delay={240} style={styles.sectionShell}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionCopy}>
              <Text style={styles.sectionEyebrow}>Shared</Text>
              <Text style={styles.sectionTitle}>Plans involving other people</Text>
            </View>
            <Button
              onPress={() => router.push("/(app)/friends")}
              style={styles.inlineButton}
              textStyle={styles.inlineButtonText}
              title="Friends"
              variant="ghost"
            />
          </View>

          <View style={styles.cardStack}>
            {sharedItems.length ? sharedItems.map((item) => (
              <PlannerCard
                item={item}
                key={`shared-${item.id}`}
                onPress={() => openItem(item)}
              />
            )) : (
              <Text style={styles.emptyText}>Nothing shared yet. Add friends and shared events will appear here.</Text>
            )}
          </View>
        </AnimatedScreenSection>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  glowA: {
    position: "absolute",
    left: -110,
    bottom: 160,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: "#8F6748",
    opacity: 0.24,
  },
  glowB: {
    position: "absolute",
    right: -80,
    top: 250,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: theme.colors.accent,
    opacity: 0.18,
  },
  content: {
    padding: 20,
    gap: 20,
    paddingBottom: 42,
  },
  heroSection: {
    gap: 16,
  },
  heroCopy: {
    gap: 8,
  },
  heroEyebrow: {
    color: theme.colors.accentHigh,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: theme.colors.textPrimary,
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
  },
  heroText: {
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  primaryActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  primaryActionButton: {
    flexGrow: 1,
    flexBasis: "31%",
    minWidth: 104,
    borderRadius: 999,
  },
  primaryActionText: {
    fontSize: 14,
  },
  bucketGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  capturePanel: {
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    padding: 20,
    gap: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#171A28",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 4,
  },
  managementText: {
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  managementStack: {
    gap: 12,
  },
  managementCard: {
    backgroundColor: theme.colors.surfaceWarm,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
    gap: 12,
  },
  managementCardEyebrow: {
    color: theme.colors.accentHigh,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  managementCardTitle: {
    color: theme.colors.textPrimary,
    fontSize: 19,
    fontWeight: "800",
  },
  managementCardText: {
    color: theme.colors.textSecondary,
    lineHeight: 21,
  },
  metricStrip: {
    flexDirection: "row",
    gap: 10,
  },
  metricTile: {
    flex: 1,
    backgroundColor: theme.colors.backgroundStrong,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 6,
  },
  metricValue: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: "800",
  },
  metricLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
  },
  calendarPreviewText: {
    color: theme.colors.textMuted,
    lineHeight: 20,
  },
  sectionShell: {
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#171A28",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  sectionCopy: {
    flex: 1,
    gap: 4,
  },
  sectionEyebrow: {
    color: theme.colors.accentHigh,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
  },
  sectionHint: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  inlineButton: {
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  inlineButtonText: {
    fontSize: 13,
  },
  cardStack: {
    gap: 12,
  },
  emptyText: {
    color: theme.colors.textMuted,
    lineHeight: 21,
  },
  errorText: {
    color: theme.colors.coralHigh,
    fontWeight: "700",
    lineHeight: 20,
  },
});
