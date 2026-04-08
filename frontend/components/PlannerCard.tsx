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
  const metaIconColor = item.is_direct_share ? theme.colors.textPrimary : theme.colors.textMuted;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <View style={[styles.priorityStripe, { backgroundColor: priorityTone }]} />
          <View style={styles.titleCopy}>
            <Text numberOfLines={1} style={styles.title}>
              {item.title}
            </Text>
            <Text numberOfLines={1} style={styles.inlineMeta}>
              {item.calendar_title || (item.is_direct_share ? "Choose calendar" : "No calendar")}
            </Text>
          </View>
        </View>
        <View style={styles.typeBadge}>
          <Text style={styles.typeLabel}>{item.type.toUpperCase()}</Text>
        </View>
      </View>

      <Text numberOfLines={2} style={styles.notes}>
        {item.notes || "Quick win, class plan, or shared event details can live here."}
      </Text>

      <View style={styles.metaRow}>
        <View style={styles.metaPill}>
          <MaterialCommunityIcons color={metaIconColor} name="calendar-clock-outline" size={16} />
          <Text style={styles.metaText}>
            {formatRelativeDate(item.due_at || item.start_at)}
          </Text>
        </View>
        <View style={styles.metaPill}>
          <MaterialCommunityIcons color={metaIconColor} name="lightning-bolt-outline" size={16} />
          <Text style={styles.metaText}>{item.effort}</Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>
          {formatDayLabel(item.due_at || item.start_at)}
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
    borderRadius: 24,
    backgroundColor: theme.colors.appCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 14,
    shadowColor: "#171A28",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 3,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ translateY: 1 }],
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  titleGroup: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: 12,
  },
  titleCopy: {
    flex: 1,
    gap: 3,
  },
  priorityStripe: {
    width: 10,
    height: 46,
    borderRadius: 999,
  },
  title: {
    color: theme.colors.appTextInverse,
    fontSize: 18,
    fontWeight: "800",
  },
  inlineMeta: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: theme.colors.backgroundStrong,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  typeLabel: {
    color: theme.colors.appTextInverse,
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
    backgroundColor: theme.colors.backgroundStrong,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  metaText: {
    color: theme.colors.textPrimary,
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
    fontWeight: "700",
  },
  shareText: {
    color: theme.colors.mintHigh,
    fontSize: 12,
    fontWeight: "700",
  },
});
