import { useEffect, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";
import type { ItemPriority, PlannerItem } from "@/types/planner";
import { formatRelativeDate } from "@/utils/dates";

type FeaturedPlannerCardProps = {
  item: PlannerItem | null;
  emptyTitle: string;
  emptyDescription: string;
  onPress?: () => void;
  onDetailsPress?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  upcomingItems?: PlannerItem[];
  queueLabel?: string;
  statusLabel?: string;
};

const priorityColors: Record<ItemPriority, string> = {
  urgent: "#FF8086",
  important: "#AEA7FF",
  normal: "#D7FF76",
  easy_win: "#FFD68C",
};

const priorityBackgrounds: Record<ItemPriority, string> = {
  urgent: "#6F4F59",
  important: "#5B5AA0",
  normal: "#577163",
  easy_win: "#796242",
};

export default function FeaturedPlannerCard({
  item,
  emptyTitle,
  emptyDescription,
  onPress,
  onDetailsPress,
  onPrev,
  onNext,
  upcomingItems = [],
  queueLabel,
  statusLabel,
}: FeaturedPlannerCardProps) {
  const title = item?.title || emptyTitle;
  const description = item?.notes || emptyDescription;
  const showDone = statusLabel || item?.status === "completed";
  const detailAction = onDetailsPress || onPress;
  const detailLabel = item ? "Open details" : "Add details";
  const activePriorityColor = item ? priorityColors[item.priority] : theme.colors.borderStrong;
  const activePriorityBackground = item ? priorityBackgrounds[item.priority] : theme.colors.surfaceWarm;
  const topMarkers = upcomingItems.slice(0, 5);
  const transitionOpacity = useRef(new Animated.Value(1)).current;
  const transitionTranslate = useRef(new Animated.Value(0)).current;
  const timeLabel = item ? formatRelativeDate(item.due_at || item.start_at || item.end_at) : "Ready to schedule";
  const laneLabel = item
    ? item.calendar_title || (item.is_direct_share ? "Shared item" : item.type === "event" ? "Event" : "Task")
    : "Pick what deserves attention first";

  useEffect(() => {
    transitionOpacity.setValue(0);
    transitionTranslate.setValue(10);

    const animation = Animated.parallel([
      Animated.timing(transitionOpacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(transitionTranslate, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }),
    ]);

    animation.start();
    return () => animation.stop();
  }, [item?.id, laneLabel, timeLabel, transitionOpacity, transitionTranslate]);

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && onPress ? styles.pressed : null]}
    >
      <View style={[styles.priorityCorner, { backgroundColor: activePriorityColor }]} />

      <Animated.View
        style={[
          styles.contentShell,
          {
            opacity: transitionOpacity,
            transform: [{ translateY: transitionTranslate }],
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.titleBlock}>
            <Text numberOfLines={1} style={styles.eyebrow}>
              {item ? "Current focus" : "Ready when you are"}
            </Text>
            <Text numberOfLines={2} style={styles.title}>
              {title}
            </Text>
          </View>
          <View style={styles.headerMeta}>
            {topMarkers.length ? (
              <View style={styles.energyRow}>
                {topMarkers.map((nextItem) => (
                  <View
                    key={nextItem.id}
                    style={[
                      styles.energyBar,
                      {
                        backgroundColor: priorityColors[nextItem.priority],
                      },
                    ]}
                  />
                ))}
              </View>
            ) : null}
            {showDone ? (
              <View style={styles.statusPill}>
                <MaterialCommunityIcons color={theme.colors.textPrimary} name="check-circle-outline" size={16} />
                <Text style={styles.statusText}>{statusLabel || "Finished"}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <MaterialCommunityIcons color={theme.colors.textPrimary} name="clock-outline" size={16} />
            <Text numberOfLines={1} style={styles.metaText}>
              {timeLabel}
            </Text>
          </View>
          <View style={styles.metaPill}>
            <MaterialCommunityIcons color={theme.colors.textPrimary} name="calendar-blank-outline" size={16} />
            <Text numberOfLines={1} style={styles.metaText}>
              {laneLabel}
            </Text>
          </View>
        </View>

        <View style={styles.descriptionCard}>
          <Text numberOfLines={4} style={styles.description}>
            {description}
          </Text>
        </View>

        <View style={styles.navigationRow}>
          <View style={styles.navigationSide}>
            {onPrev ? (
              <Pressable accessibilityRole="button" onPress={onPrev} style={styles.arrowButton}>
                <MaterialCommunityIcons color={theme.colors.textPrimary} name="chevron-left" size={20} />
              </Pressable>
            ) : null}
          </View>

          {queueLabel ? <Text style={styles.queueLabel}>{queueLabel}</Text> : null}

          <View style={[styles.navigationSide, styles.navigationSideRight]}>
            {onNext ? (
              <Pressable accessibilityRole="button" onPress={onNext} style={styles.arrowButton}>
                <MaterialCommunityIcons color={theme.colors.textPrimary} name="chevron-right" size={20} />
              </Pressable>
            ) : null}
          </View>
        </View>

        <View style={styles.footerRow}>
          <Pressable
            accessibilityRole="button"
            disabled={!detailAction}
            onPress={detailAction}
            style={[
              styles.detailsRail,
              { backgroundColor: activePriorityBackground, borderColor: activePriorityColor },
              !detailAction && styles.detailsRailMuted,
            ]}
          >
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { backgroundColor: activePriorityColor }]} />
            </View>
            <View style={styles.detailCopy}>
              <Text numberOfLines={1} style={styles.detailText}>
                {detailLabel}
              </Text>
              <MaterialCommunityIcons color={theme.colors.textPrimary} name="arrow-right" size={18} />
            </View>
          </Pressable>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    backgroundColor: theme.colors.appCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
    gap: 16,
    overflow: "hidden",
    shadowColor: "#171A28",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 4,
  },
  pressed: {
    opacity: 0.92,
  },
  contentShell: {
    gap: 14,
  },
  priorityCorner: {
    position: "absolute",
    left: -8,
    top: -8,
    width: 36,
    height: 36,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: theme.colors.coral,
    transform: [{ rotate: "90deg" }],
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    paddingLeft: 34,
  },
  titleBlock: {
    flex: 1,
    gap: 5,
  },
  eyebrow: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 21,
    fontWeight: "800",
    lineHeight: 26,
  },
  headerMeta: {
    alignItems: "flex-end",
    gap: 8,
  },
  energyRow: {
    flexDirection: "row",
    gap: 6,
  },
  energyBar: {
    width: 8,
    height: 24,
    borderRadius: 12,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metaPill: {
    minWidth: 132,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: theme.colors.backgroundStrong,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  metaText: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  descriptionCard: {
    minHeight: 92,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceWarm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: "center",
  },
  description: {
    color: theme.colors.textSecondary,
    lineHeight: 23,
    fontSize: 15,
  },
  navigationRow: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  navigationSide: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  navigationSideRight: {
    alignItems: "flex-end",
  },
  arrowButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.backgroundStrong,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  queueLabel: {
    flex: 1,
    textAlign: "center",
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  footerRow: {
    minHeight: 56,
  },
  detailsRail: {
    gap: 10,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  detailsRailMuted: {
    opacity: 0.65,
  },
  progressTrack: {
    width: "100%",
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    overflow: "hidden",
  },
  progressFill: {
    width: "100%",
    height: "100%",
  },
  detailCopy: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  detailText: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  statusPill: {
    minHeight: 32,
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceWarm,
    borderRadius: 999,
    flexDirection: "row",
    gap: 6,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
  },
  statusText: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
});
