import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";
import type { PlannerItem } from "@/types/planner";
import { formatDayLabel, formatRelativeDate } from "@/utils/dates";

type PlannerCardProps = {
  item: PlannerItem;
  onPress?: () => void;
};

export default function PlannerCard({ item, onPress }: PlannerCardProps) {
  const priorityTone = priorityPalettes[item.priority];

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <View style={[styles.priorityDot, { backgroundColor: priorityTone }]} />
          <Text numberOfLines={1} style={styles.title}>
            {item.title}
          </Text>
        </View>
        <Text style={styles.typeLabel}>{item.type.toUpperCase()}</Text>
      </View>

      <Text numberOfLines={2} style={styles.notes}>
        {item.notes || "Quick win, class plan, or shared event details can live here."}
      </Text>

      <View style={styles.metaRow}>
        <View style={styles.metaPill}>
          <MaterialCommunityIcons color={theme.colors.textSecondary} name="calendar-clock-outline" size={16} />
          <Text style={styles.metaText}>
            {formatRelativeDate(item.due_at || item.start_at)}
          </Text>
        </View>
        <View style={styles.metaPill}>
          <MaterialCommunityIcons color={theme.colors.textSecondary} name="lightning-bolt-outline" size={16} />
          <Text style={styles.metaText}>{item.effort}</Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>
          {item.calendar_title || "No calendar"} · {formatDayLabel(item.due_at || item.start_at)}
        </Text>
        {item.shares.length ? (
          <Text style={styles.shareText}>{item.shares.length} shared</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const priorityPalettes = {
  urgent: theme.colors.coral,
  important: theme.colors.accent,
  normal: theme.colors.mint,
  easy_win: theme.colors.amber,
} as const;

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  titleGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 17,
    fontWeight: "800",
    flex: 1,
  },
  typeLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  notes: {
    color: theme.colors.textSecondary,
    lineHeight: 21,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.surfaceMuted,
  },
  metaText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  footerText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    flex: 1,
  },
  shareText: {
    color: theme.colors.accent,
    fontSize: 12,
    fontWeight: "700",
  },
});
