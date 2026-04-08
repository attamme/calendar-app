import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";

type TopBarProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  tone?: "light" | "figma";
};

export default function TopBar({
  title,
  subtitle,
  onBack,
  actionLabel,
  onAction,
  actionDisabled,
  tone = "light",
}: TopBarProps) {
  const palette = tone === "figma" ? figmaPalette : lightPalette;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          disabled={!onBack}
          onPress={onBack}
          style={[
            styles.iconButton,
            { backgroundColor: palette.iconBackground, opacity: onBack ? 1 : 0 },
          ]}
        >
          <MaterialCommunityIcons color={palette.iconColor} name="chevron-left" size={24} />
        </Pressable>

        <Text numberOfLines={1} style={[styles.title, { color: palette.titleColor }]}>
          {title}
        </Text>

        {onAction || actionLabel ? (
          <Pressable
            accessibilityRole="button"
            disabled={!onAction || actionDisabled}
            onPress={onAction}
            style={[
              styles.actionButton,
              {
                backgroundColor: palette.actionBackground,
                opacity: !onAction || actionDisabled ? 0.45 : 1,
              },
            ]}
          >
            <Text style={[styles.actionLabel, { color: palette.actionColor }]}>
              {actionLabel || "Done"}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.actionSpacer} />
        )}
      </View>

      {subtitle ? (
        <Text style={[styles.subtitle, { color: palette.subtitleColor }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const lightPalette = {
  iconBackground: theme.colors.surface,
  iconColor: theme.colors.textPrimary,
  titleColor: theme.colors.textPrimary,
  subtitleColor: theme.colors.textSecondary,
  actionBackground: theme.colors.surfaceMuted,
  actionColor: theme.colors.textPrimary,
} as const;

const figmaPalette = {
  iconBackground: theme.colors.figmaSurface,
  iconColor: theme.colors.figmaText,
  titleColor: theme.colors.figmaText,
  subtitleColor: theme.colors.figmaSubtext,
  actionBackground: theme.colors.figmaAccent,
  actionColor: theme.colors.figmaText,
} as const;

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    lineHeight: 21,
  },
  actionButton: {
    minWidth: 66,
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontWeight: "800",
    fontSize: 14,
  },
  actionSpacer: {
    width: 66,
    height: 42,
  },
});
