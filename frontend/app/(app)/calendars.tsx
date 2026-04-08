import { useIsFocused } from "@react-navigation/native";
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
import { createCalendar, fetchCalendars, fetchFriends, shareCalendar } from "@/services/api";
import { theme } from "@/theme/tokens";
import type { FriendConnection, PlannerCalendar, SharePermission } from "@/types/planner";

const colorOptions = ["#3D6BFF", "#2F9E7C", "#F2B84B", "#E46F55", "#7D6BFF"];
const categoryOptions = ["school", "work", "personal", "health", "routines"];

export default function CalendarsScreen() {
  const { token } = useAuth();
  const isFocused = useIsFocused();

  const [calendars, setCalendars] = useState<PlannerCalendar[]>([]);
  const [friends, setFriends] = useState<FriendConnection[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("school");
  const [color, setColor] = useState(colorOptions[0]);

  const [selectedCalendarId, setSelectedCalendarId] = useState<number | null>(null);
  const [shareUsername, setShareUsername] = useState("");
  const [sharePermission, setSharePermission] = useState<Exclude<SharePermission, "owner">>("view");

  const loadCalendars = useCallback(async () => {
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
      setError(caughtError instanceof Error ? caughtError.message : "Failed to load calendars");
    } finally {
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token || !isFocused) {
      return;
    }

    loadCalendars();
  }, [token, isFocused, loadCalendars]);

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
      await loadCalendars();
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
      await loadCalendars();
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
            onRefresh={loadCalendars}
            refreshing={refreshing}
            tintColor={theme.colors.accent}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Calendar structure</Text>
          <Text style={styles.title}>Separate school, work, health, and routines before they blur together.</Text>
          <Text style={styles.subtitle}>
            Each calendar can be shared independently, which keeps group projects and personal planning from stepping on each other.
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Create a calendar</Text>
          <InputText
            label="Title"
            onChangeText={setTitle}
            placeholder="Semester 2, Household, Client work, Gym reset..."
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
            <View style={styles.colorRow}>
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
            Share a full calendar with a friend and choose whether they can only view or also edit.
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
            label="Friend username"
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

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            disabled={!selectedCalendarId || !shareUsername.trim()}
            onPress={handleShareCalendar}
            title="Share calendar"
            variant="secondary"
          />
        </View>

        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Your calendars</Text>
          <View style={styles.calendarList}>
            {calendars.map((calendar) => (
              <View key={calendar.id} style={styles.calendarCard}>
                <View style={styles.calendarHeader}>
                  <View style={styles.calendarTitleRow}>
                    <View style={[styles.calendarSwatch, { backgroundColor: calendar.color }]} />
                    <View style={styles.calendarCopy}>
                      <Text style={styles.calendarTitle}>{calendar.title}</Text>
                      <Text style={styles.calendarMeta}>
                        {calendar.category} · {calendar.item_count} items
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
                  {calendar.description || "No description yet. Great place to define what belongs here."}
                </Text>
              </View>
            ))}
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
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  eyebrow: {
    color: theme.colors.mint,
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
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
  listSection: {
    gap: 12,
  },
  listTitle: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: "800",
  },
  calendarList: {
    gap: 12,
  },
  calendarCard: {
    backgroundColor: theme.colors.surfaceWarm,
    borderRadius: 24,
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
    color: theme.colors.coral,
    fontWeight: "700",
  },
});
