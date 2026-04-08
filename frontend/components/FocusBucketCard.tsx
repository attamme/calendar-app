import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";
import type { PlannerItem } from "@/types/planner";
import { formatRelativeDate } from "@/utils/dates";

type BucketTone = "accent" | "coral" | "mint";

type FocusBucketCardProps = {
  title: string;
  count: number;
  subtitle: string;
  tone?: BucketTone;
  items?: PlannerItem[];
  onPress?: () => void;
};

const palettes: Record<
  BucketTone,
  { background: string; border: string; badge: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }
> = {
  accent: {
    background: "#5B5AA0",
    border: theme.colors.accentHigh,
    badge: "#7A73D8",
    icon: "timer-sand",
  },
  coral: {
    background: "#7D5961",
    border: theme.colors.coralHigh,
    badge: "#9D6971",
    icon: "alert-circle-outline",
  },
  mint: {
    background: "#58715E",
    border: theme.colors.mintHigh,
    badge: "#6D8C74",
    icon: "flash-outline",
  },
};

export default function FocusBucketCard({
  title,
  count,
  subtitle,
  tone = "accent",
  items = [],
  onPress,
}: FocusBucketCardProps) {
  const palette = palettes[tone];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
        },
        pressed && onPress ? styles.pressed : null,
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{title}</Text>
          <Text numberOfLines={2} style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
        <View style={[styles.countBadge, { backgroundColor: palette.badge }]}>
          <MaterialCommunityIcons color={theme.colors.textPrimary} name={palette.icon} size={18} />
          <Text style={styles.countText}>{count}</Text>
        </View>
      </View>

      <View style={styles.previewStack}>
        {items.length ? (
          items.slice(0, 2).map((item) => (
            <View key={item.id} style={styles.previewRow}>
              <View style={styles.previewDot} />
              <View style={styles.previewCopy}>
                <Text numberOfLines={1} style={styles.previewTitle}>
                  {item.title}
                </Text>
                <Text numberOfLines={1} style={styles.previewMeta}>
                  {formatRelativeDate(item.due_at || item.start_at)}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nothing here right now.</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 180,
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    gap: 16,
    shadowColor: "#171A28",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 3,
  },
  pressed: {
    opacity: 0.94,
    transform: [{ translateY: 1 }],
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  headerCopy: {
    flex: 1,
    gap: 6,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  countBadge: {
    minWidth: 62,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    flexDirection: "row",
    gap: 6,
  },
  countText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },
  previewStack: {
    gap: 10,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  previewDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.textPrimary,
  },
  previewCopy: {
    flex: 1,
    gap: 3,
  },
  previewTitle: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  previewMeta: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyText: {
    color: theme.colors.textMuted,
    lineHeight: 20,
  },
});
