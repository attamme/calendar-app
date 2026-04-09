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
import {
  createCalendar,
  fetchCalendars,
  fetchFriends,
  shareCalendar,
} from "@/services/api";
import { theme } from "@/theme/tokens";
import type {
  FriendConnection,
  PlannerCalendar,
  SharePermission,
} from "@/types/planner";

const colorOptions = ["#90A7FF", "#6AD4A7", "#FFD27D", "#FF9787", "#A996FF"];
const categoryOptions = ["school", "work", "personal", "health", "routines"];

export default function CalendarCenterScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { notifyPlannerChanged } = usePlannerSync();

  const [calendars, setCalendars] = useState<PlannerCalendar[]>([]);
  const [friends, setFriends] = useState<FriendConnection[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("school");
  const [color, setColor] = useState(colorOptions[0]);
  const [selectedCalendarId, setSelectedCalendarId] = useState<number | null>(null);
  const [shareUsername, setShareUsername] = useState("");
  const [sharePermission, setSharePermission] = useState<Exclude<SharePermission, "owner">>("view");

  const loadData = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      setRefreshing(true);
      setError("");
      const [calendarResponse, friendResponse] = await Promise.all([
        fetchCalendars(token),
        fetchFriends(token),
      ]);

      startTransition(() => {
        setCalendars(calendarResponse.calendars);
        setFriends(friendResponse.friends);
        setSelectedCalendarId((current) => current || calendarResponse.calendars[0]?.id || null);
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to load calendar center");
    } finally {
      setRefreshing(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadData();
      return undefined;
    }, [loadData])
  );

  function exitScreen() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(app)/calendars");
  }

  async function handleCreateCalendar() {
    if (!token) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      await createCalendar({ title, description, category, color }, token);
      startTransition(() => {
        setTitle("");
        setDescription("");
        setCategory("school");
        setColor(colorOptions[0]);
      });
      notifyPlannerChanged();
      await loadData();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to create calendar");
    } finally {
      setSaving(false);
    }
  }

  async function handleShareCalendar() {
    if (!token || !selectedCalendarId) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      await shareCalendar(selectedCalendarId, shareUsername, sharePermission, token);
      startTransition(() => {
        setShareUsername("");
      });
      notifyPlannerChanged();
      await loadData();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to share calendar");
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
            onRefresh={loadData}
            refreshing={refreshing}
            tintColor={theme.colors.accentHigh}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <HiFiHeader
          leftIcon="chevron-left"
          onLeftPress={exitScreen}
          title="Calendar center"
        />

        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Calendar setup</Text>
          <Text style={styles.heroTitle}>Keep creation, sharing, and structure in one place.</Text>
          <Text style={styles.heroText}>
            Manage calendars here so the month view can stay clean and easy to scan.
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Create a calendar</Text>
          <InputText
            label="Title"
            onChangeText={setTitle}
            placeholder="Semester 2, Household, Client work..."
            value={title}
          />
          <InputText
            label="Description"
            multiline
            onChangeText={setDescription}
            placeholder="What kind of plans live in this calendar?"
            value={description}
          />

          <View style={styles.group}>
            <Text style={styles.groupLabel}>Life area</Text>
            <View style={styles.chipRow}>
              {categoryOptions.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  onPress={() => setCategory(option)}
                  selected={category === option}
                  tone="accent"
                />
              ))}
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.groupLabel}>Color</Text>
            <View style={styles.chipRow}>
              {colorOptions.map((option) => (
                <Chip
                  key={option}
                  label={option.replace("#", "")}
                  onPress={() => setColor(option)}
                  rightSlot={<View style={[styles.colorDot, { backgroundColor: option }]} />}
                  selected={color === option}
                  tone="neutral"
                />
              ))}
            </View>
          </View>

          <Button
            disabled={!title.trim()}
            loading={saving}
            onPress={handleCreateCalendar}
            title="Create calendar"
          />
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Share a calendar</Text>
          <Text style={styles.panelText}>
            Share a whole calendar when the entire stream belongs together.
          </Text>

          <View style={styles.group}>
            <Text style={styles.groupLabel}>Pick a calendar</Text>
            <View style={styles.chipRow}>
              {calendars.filter((calendar) => calendar.is_owner).map((calendar) => (
                <Chip
                  key={calendar.id}
                  label={calendar.title}
                  onPress={() => setSelectedCalendarId(calendar.id)}
                  selected={selectedCalendarId === calendar.id}
                  tone="amber"
                />
              ))}
            </View>
          </View>

          <InputText
            autoCapitalize="none"
            label="Friend username or email"
            onChangeText={setShareUsername}
            placeholder="Pick from your friends or type a username"
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

          <View style={styles.group}>
            <Text style={styles.groupLabel}>Permission</Text>
            <View style={styles.chipRow}>
              {(["view", "edit"] as const).map((permission) => (
                <Chip
                  key={permission}
                  label={permission === "view" ? "View only" : "Can edit"}
                  onPress={() => setSharePermission(permission)}
                  selected={sharePermission === permission}
                  tone={permission === "view" ? "accent" : "coral"}
                />
              ))}
            </View>
          </View>

          <Button
            disabled={!selectedCalendarId || !shareUsername.trim()}
            loading={saving}
            onPress={handleShareCalendar}
            title="Share calendar"
            variant="secondary"
          />
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Your calendars</Text>
          <View style={styles.calendarList}>
            {calendars.map((calendar) => (
              <View key={calendar.id} style={styles.calendarCard}>
                <View style={styles.calendarHeader}>
                  <View style={styles.calendarTitleRow}>
                    <View style={[styles.calendarSwatch, { backgroundColor: calendar.color }]} />
                    <View style={styles.calendarCopy}>
                      <Text style={styles.calendarTitle}>{calendar.title}</Text>
                      <Text style={styles.calendarMeta}>
                        {calendar.category} | {calendar.item_count} items
                      </Text>
                    </View>
                  </View>
                  <Chip
                    label={calendar.is_owner ? "Owner" : calendar.access_permission}
                    selected
                    tone={calendar.is_owner ? "accent" : "amber"}
                  />
                </View>
                <Text style={styles.calendarDescription}>
                  {calendar.description || "No description yet."}
                </Text>
              </View>
            ))}
          </View>
        </View>

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
    gap: 16,
  },
  panelTitle: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: "800",
  },
  panelText: {
    color: theme.colors.textSecondary,
    lineHeight: 21,
  },
  group: {
    gap: 10,
  },
  groupLabel: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  calendarList: {
    gap: 12,
  },
  calendarCard: {
    backgroundColor: theme.colors.surfaceWarm,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
    gap: 14,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  calendarTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  calendarSwatch: {
    width: 16,
    height: 56,
    borderRadius: 999,
  },
  calendarCopy: {
    gap: 4,
    flex: 1,
  },
  calendarTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  calendarMeta: {
    color: theme.colors.textSecondary,
  },
  calendarDescription: {
    color: theme.colors.textSecondary,
    lineHeight: 21,
  },
  errorText: {
    color: theme.colors.coralHigh,
    fontWeight: "700",
    lineHeight: 20,
  },
});
