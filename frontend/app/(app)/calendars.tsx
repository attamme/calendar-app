import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Button from "@/components/button";
import AnimatedScreenSection from "@/components/AnimatedScreenSection";
import Chip from "@/components/Chip";
import FeaturedPlannerCard from "@/components/FeaturedPlannerCard";
import HiFiHeader from "@/components/HiFiHeader";
import InputText from "@/components/InputText";
import { useAuth } from "@/providers/AuthProvider";
import { usePlannerSync } from "@/providers/PlannerSyncProvider";
import {
  createCalendar,
  fetchCalendars,
  fetchFriends,
  fetchItems,
  shareCalendar,
} from "@/services/api";
import { theme } from "@/theme/tokens";
import type {
  FriendConnection,
  PlannerCalendar,
  PlannerItem,
  SharePermission,
} from "@/types/planner";
import {
  addMonths,
  buildMonthGrid,
  formatTimeOnly,
  getDateKey,
  getMonthLabel,
  getWeekdayLabels,
  isToday,
} from "@/utils/dates";

const colorOptions = ["#90A7FF", "#6AD4A7", "#FFD27D", "#FF9787", "#A996FF"];
const categoryOptions = ["school", "work", "personal", "health", "routines"];

type CalendarFilter = "all" | "needs_filing" | number;

function getItemAnchor(item: PlannerItem) {
  if (item.type === "event") {
    return item.start_at || item.end_at || item.due_at || item.created_at;
  }

  return item.due_at || item.start_at || item.snoozed_until || item.created_at;
}

function compareItemsByAnchor(left: PlannerItem, right: PlannerItem) {
  const leftAnchor = getItemAnchor(left);
  const rightAnchor = getItemAnchor(right);
  const leftTime = leftAnchor ? new Date(leftAnchor).getTime() : Number.MAX_SAFE_INTEGER;
  const rightTime = rightAnchor ? new Date(rightAnchor).getTime() : Number.MAX_SAFE_INTEGER;

  if (leftTime !== rightTime) {
    return leftTime - rightTime;
  }

  return left.title.localeCompare(right.title);
}

function formatSelectedDateLabel(dateKey: string) {
  if (!dateKey) {
    return "Pick a day";
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

function buildIsoFromDateKey(dateKey: string, hour: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, hour, 0, 0, 0).toISOString();
}

function buildNewItemParams(
  dateKey: string,
  type: "task" | "event",
  calendarId?: number | null
) {
  return {
    id: "new",
    type,
    dueAt: buildIsoFromDateKey(dateKey, 18),
    startAt: buildIsoFromDateKey(dateKey, 9),
    endAt: buildIsoFromDateKey(dateKey, 10),
    ...(calendarId ? { calendarId: String(calendarId) } : {}),
  };
}

export default function CalendarsScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { notifyPlannerChanged, refreshVersion } = usePlannerSync();

  const [calendars, setCalendars] = useState<PlannerCalendar[]>([]);
  const [friends, setFriends] = useState<FriendConnection[]>([]);
  const [items, setItems] = useState<PlannerItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const loadRequestRef = useRef(0);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [selectedDateKey, setSelectedDateKey] = useState(() => getDateKey(new Date()));
  const [calendarFilter, setCalendarFilter] = useState<CalendarFilter>("all");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("school");
  const [color, setColor] = useState(colorOptions[0]);

  const [selectedCalendarId, setSelectedCalendarId] = useState<number | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [shareUsername, setShareUsername] = useState("");
  const [sharePermission, setSharePermission] = useState<Exclude<SharePermission, "owner">>("view");

  const loadCalendars = useCallback(async () => {
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
        fetchItems(token, "all"),
      ]);

      if (requestId !== loadRequestRef.current) {
        return;
      }

      startTransition(() => {
        setCalendars(calendarResponse.calendars);
        setFriends(friendResponse.friends);
        setItems(itemResponse.items);
        setSelectedCalendarId((current) => current || calendarResponse.calendars[0]?.id || null);
      });
    } catch (caughtError) {
      if (requestId !== loadRequestRef.current) {
        return;
      }

      setError(caughtError instanceof Error ? caughtError.message : "Failed to load calendars");
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

      loadCalendars();
      return undefined;
    }, [loadCalendars, token])
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    loadCalendars();
  }, [loadCalendars, refreshVersion, token]);

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
      notifyPlannerChanged();
      await loadCalendars();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to share calendar");
    } finally {
      setSaving(false);
    }
  }

  const needsFilingCount = items.filter((item) => item.is_direct_share && !item.calendar_id).length;
  const filteredItems = items.filter((item) => {
    if (calendarFilter === "all") {
      return true;
    }

    if (calendarFilter === "needs_filing") {
      return item.is_direct_share && !item.calendar_id;
    }

    return item.calendar_id === calendarFilter;
  });

  const itemsByDay = new Map<string, PlannerItem[]>();
  filteredItems.forEach((item) => {
    const dateKey = getDateKey(getItemAnchor(item));

    if (!dateKey) {
      return;
    }

    const current = itemsByDay.get(dateKey) || [];
    current.push(item);
    current.sort(compareItemsByAnchor);
    itemsByDay.set(dateKey, current);
  });

  const gridDays = buildMonthGrid(visibleMonth);
  const weekdayLabels = getWeekdayLabels();
  const selectedDayItems = itemsByDay.get(selectedDateKey) || [];
  const featuredQueue = selectedDayItems.length ? selectedDayItems : filteredItems;
  const featuredItem = featuredQueue[featuredIndex] || null;
  const upcomingFeaturedItems = featuredQueue.slice(featuredIndex + 1, featuredIndex + 6);
  const headerTitle =
    typeof calendarFilter === "number"
      ? calendars.find((calendar) => calendar.id === calendarFilter)?.title || "Work Calendar"
      : calendarFilter === "needs_filing"
        ? "Shared Items"
        : "Work Calendar";

  useEffect(() => {
    setFeaturedIndex(0);
  }, [selectedDateKey, calendarFilter]);

  useEffect(() => {
    setFeaturedIndex((current) => Math.min(current, Math.max(featuredQueue.length - 1, 0)));
  }, [featuredQueue.length]);

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
        <AnimatedScreenSection delay={0}>
          <HiFiHeader
            leftIcon="chevron-left"
            onLeftPress={() => router.push("/(app)/dashboard")}
            rightIcon="account-group-outline"
            onRightPress={() => router.push("/(app)/friends")}
            title={headerTitle}
          />
        </AnimatedScreenSection>

        <AnimatedScreenSection delay={40}>
          <FeaturedPlannerCard
            emptyDescription="Pick a day, add a task or event, and it will show up here with its reminder context."
            emptyTitle="Tasks to do"
            item={featuredItem}
            onDetailsPress={featuredItem ? () => router.push(`/planner-item/${featuredItem.id}`) : undefined}
            onNext={featuredIndex < featuredQueue.length - 1 ? () => setFeaturedIndex((current) => current + 1) : undefined}
            onPress={featuredItem ? () => router.push(`/planner-item/${featuredItem.id}`) : undefined}
            onPrev={featuredIndex > 0 ? () => setFeaturedIndex((current) => current - 1) : undefined}
            queueLabel={featuredQueue.length > 1 ? `${featuredIndex + 1} of ${featuredQueue.length}` : undefined}
            upcomingItems={upcomingFeaturedItems}
          />
        </AnimatedScreenSection>

        <AnimatedScreenSection delay={80} style={styles.actionRow}>
          <Button
            onPress={() => setCalendarFilter("all")}
            style={styles.actionButton}
            textStyle={styles.actionButtonText}
            title="All calendars"
            variant="secondary"
          />
          <Button
            onPress={() =>
              router.push({
                pathname: "/planner-item/[id]",
                params: buildNewItemParams(
                  selectedDateKey,
                  "task",
                  typeof calendarFilter === "number" ? calendarFilter : selectedCalendarId
                ),
              })
            }
            style={styles.actionButton}
            textStyle={styles.actionButtonText}
            title="New task"
          />
          <Button
            onPress={() =>
              router.push({
                pathname: "/planner-item/[id]",
                params: buildNewItemParams(
                  selectedDateKey,
                  "event",
                  typeof calendarFilter === "number" ? calendarFilter : selectedCalendarId
                ),
              })
            }
            style={styles.actionButton}
            textStyle={styles.actionButtonText}
            title="New event"
            variant="ghost"
          />
        </AnimatedScreenSection>

        <AnimatedScreenSection delay={120} style={styles.panel}>
          <View style={styles.monthHeader}>
            <View>
              <Text style={styles.panelTitle}>{getMonthLabel(visibleMonth)}</Text>
            </View>
            <View style={styles.monthActions}>
              <Pressable
                onPress={() => setVisibleMonth((current) => addMonths(current, -1))}
                style={styles.navButton}
              >
                <MaterialCommunityIcons color={theme.colors.textPrimary} name="chevron-left" size={22} />
              </Pressable>
              <Pressable
                onPress={() => setVisibleMonth((current) => addMonths(current, 1))}
                style={styles.navButton}
              >
                <MaterialCommunityIcons color={theme.colors.textPrimary} name="chevron-right" size={22} />
              </Pressable>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            <Chip
              label="All calendars"
              onPress={() => setCalendarFilter("all")}
              selected={calendarFilter === "all"}
              tone="accent"
            />
            {needsFilingCount ? (
              <Chip
                label="Needs filing"
                onPress={() => setCalendarFilter("needs_filing")}
                selected={calendarFilter === "needs_filing"}
                tone="coral"
              />
            ) : null}
            {calendars.map((calendar) => (
              <Chip
                key={calendar.id}
                label={calendar.title}
                onPress={() => setCalendarFilter(calendar.id)}
                selected={calendarFilter === calendar.id}
                rightSlot={<View style={[styles.colorDot, { backgroundColor: calendar.color }]} />}
                tone={calendar.is_owner ? "accent" : "amber"}
              />
            ))}
          </ScrollView>

          <View style={styles.monthGridShell}>
            <View style={styles.weekdayRow}>
              {weekdayLabels.map((label, index) => (
                <Text
                  key={label}
                  style={[styles.weekdayLabel, index >= 5 ? styles.weekendLabel : null]}
                >
                  {label.slice(0, 3)}
                </Text>
              ))}
            </View>

            <View style={styles.grid}>
              {gridDays.map((day) => {
                const dayKey = getDateKey(day);
                const dayItems = itemsByDay.get(dayKey) || [];
                const inCurrentMonth = day.getMonth() === visibleMonth.getMonth();
                const isSelected = dayKey === selectedDateKey;

                return (
                  <Pressable
                    key={dayKey}
                    onPress={() => {
                      setSelectedDateKey(dayKey);
                      if (!inCurrentMonth) {
                        setVisibleMonth(new Date(day.getFullYear(), day.getMonth(), 1));
                      }
                    }}
                    style={[
                      styles.dayCell,
                      !inCurrentMonth && styles.dayCellMuted,
                      isSelected && styles.dayCellSelected,
                    ]}
                  >
                    <View style={styles.dayHeader}>
                      <Text style={[styles.dayLabel, !inCurrentMonth && styles.dayLabelMuted]}>
                        {day.getDate()}
                      </Text>
                      {isToday(day) ? <View style={styles.todayDot} /> : null}
                    </View>

                    <View style={styles.dayPreviewList}>
                      {dayItems.slice(0, 3).map((item) => (
                        <View
                          key={`${dayKey}-${item.id}`}
                          style={[
                            styles.dayPreview,
                            { backgroundColor: item.calendar_color || theme.colors.accentHigh },
                          ]}
                        />
                      ))}
                      {dayItems.length > 3 ? (
                        <Text style={styles.moreLabel}>+{dayItems.length - 3}</Text>
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </AnimatedScreenSection>

        <AnimatedScreenSection delay={160} style={styles.bottomActionRow}>
          <Button
            onPress={() =>
              router.push({
                pathname: "/planner-item/[id]",
                params: buildNewItemParams(
                  selectedDateKey,
                  "task",
                  typeof calendarFilter === "number" ? calendarFilter : selectedCalendarId
                ),
              })
            }
            style={styles.addTodoButton}
            title="Add todo"
          />
        </AnimatedScreenSection>

        <AnimatedScreenSection delay={200} style={styles.panel}>
          <View style={styles.agendaHeader}>
            <View>
              <Text style={styles.panelTitle}>{formatSelectedDateLabel(selectedDateKey)}</Text>
              <Text style={styles.panelText}>
                {selectedDayItems.length
                  ? `${selectedDayItems.length} item${selectedDayItems.length === 1 ? "" : "s"} on this day`
                  : "No items yet. Good place to drop a task, class, or friend plan."}
              </Text>
            </View>
            <Button
              onPress={() =>
                router.push({
                  pathname: "/planner-item/[id]",
                  params: buildNewItemParams(
                    selectedDateKey,
                    "task",
                    typeof calendarFilter === "number" ? calendarFilter : selectedCalendarId
                  ),
                })
              }
              style={styles.inlineButton}
              title="Add on this day"
              variant="secondary"
            />
          </View>

          <View style={styles.agendaList}>
            {selectedDayItems.length ? (
              selectedDayItems.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => router.push(`/planner-item/${item.id}`)}
                  style={styles.agendaCard}
                >
                  <View
                    style={[
                      styles.agendaStripe,
                      { backgroundColor: item.calendar_color || theme.colors.accent },
                    ]}
                  />
                  <View style={styles.agendaCopy}>
                    <View style={styles.agendaTopRow}>
                      <Text numberOfLines={1} style={styles.agendaTitle}>
                        {item.title}
                      </Text>
                      <Text style={styles.agendaTime}>{formatTimeOnly(getItemAnchor(item)) || "Anytime"}</Text>
                    </View>
                    <Text numberOfLines={2} style={styles.agendaMeta}>
                      {(item.calendar_title || (item.is_direct_share ? "Needs a calendar" : "No calendar"))}
                      {" | "}
                      {item.type}
                      {item.is_direct_share ? " | shared" : ""}
                    </Text>
                  </View>
                </Pressable>
              ))
            ) : (
              <Text style={styles.emptyText}>Tap a day, add a task or event, and it will show up here and in the month grid.</Text>
            )}
          </View>
        </AnimatedScreenSection>

        <AnimatedScreenSection delay={240} style={styles.panel}>
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
        </AnimatedScreenSection>

        <AnimatedScreenSection delay={280} style={styles.panel}>
          <Text style={styles.panelTitle}>Share a calendar</Text>
          <Text style={styles.panelText}>
            Share full calendars when the whole stream belongs together. Direct item sharing stays better for one-off events.
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

          <Button
            disabled={!selectedCalendarId || !shareUsername.trim()}
            onPress={handleShareCalendar}
            title="Share calendar"
            variant="secondary"
          />
        </AnimatedScreenSection>

        <AnimatedScreenSection delay={320} style={styles.listSection}>
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
                  {calendar.description || "No description yet. Great place to define what belongs here."}
                </Text>
              </View>
            ))}
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
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 36,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  actionButton: {
    flexGrow: 1,
    flexBasis: "31%",
    minWidth: 96,
    minHeight: 39,
    borderRadius: 999,
  },
  actionButtonText: {
    fontSize: 13,
  },
  bottomActionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  addTodoButton: {
    width: 152,
    borderRadius: 999,
  },
  panel: {
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
  panelTitle: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: "800",
  },
  panelText: {
    color: theme.colors.textSecondary,
    lineHeight: 21,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  monthActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceMuted,
  },
  filterRow: {
    gap: 10,
  },
  monthGridShell: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundStrong,
  },
  weekdayRow: {
    flexDirection: "row",
    backgroundColor: theme.colors.backgroundStrong,
  },
  weekdayLabel: {
    flex: 1,
    minWidth: 0,
    textAlign: "center",
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    paddingVertical: 12,
    backgroundColor: theme.colors.backgroundStrong,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
  },
  weekendLabel: {
    color: theme.colors.appWeekend,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: theme.colors.border,
  },
  dayCell: {
    width: "14.2857%",
    minHeight: 72,
    padding: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceWarm,
  },
  dayCellMuted: {
    backgroundColor: theme.colors.backgroundStrong,
  },
  dayCellSelected: {
    borderColor: theme.colors.accentHigh,
    borderWidth: 2,
    backgroundColor: "#5D5D9D",
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  dayLabel: {
    color: theme.colors.textPrimary,
    fontWeight: "700",
    fontSize: 15,
  },
  dayLabelMuted: {
    color: "#9CA5C7",
  },
  todayDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: theme.colors.coral,
  },
  dayPreviewList: {
    gap: 3,
  },
  dayPreview: {
    height: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  moreLabel: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
  },
  agendaHeader: {
    gap: 10,
  },
  inlineButton: {
    alignSelf: "flex-start",
  },
  agendaList: {
    gap: 10,
  },
  agendaCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: theme.colors.surfaceWarm,
    borderRadius: 10,
    padding: 14,
  },
  agendaStripe: {
    width: 8,
    borderRadius: 999,
  },
  agendaCopy: {
    flex: 1,
    gap: 6,
  },
  agendaTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  agendaTitle: {
    color: theme.colors.textPrimary,
    fontWeight: "800",
    fontSize: 16,
    flex: 1,
  },
  agendaTime: {
    color: theme.colors.textSecondary,
    fontWeight: "700",
  },
  agendaMeta: {
    color: theme.colors.textSecondary,
    lineHeight: 20,
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
    borderRadius: 12,
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
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
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
  emptyText: {
    color: theme.colors.textMuted,
    lineHeight: 20,
  },
  errorText: {
    color: theme.colors.coral,
    fontWeight: "700",
  },
});
