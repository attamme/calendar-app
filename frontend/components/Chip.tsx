import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  tone?: "accent" | "mint" | "amber" | "coral" | "neutral";
  rightSlot?: ReactNode;
};

export default function Chip({
  label,
  selected,
  onPress,
  tone = "neutral",
  rightSlot,
}: ChipProps) {
  const palette = palettes[tone];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.base,
        {
          backgroundColor: selected ? palette.background : theme.colors.surfaceWarm,
          borderColor: selected ? palette.border : theme.colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: selected ? palette.text : theme.colors.textPrimary },
        ]}
      >
        {label}
      </Text>
      {rightSlot ? <View>{rightSlot}</View> : null}
    </Pressable>
  );
}

const palettes = {
  accent: {
    background: "#5B5AA0",
    border: theme.colors.accentHigh,
    text: theme.colors.textPrimary,
  },
  mint: {
    background: "#557668",
    border: theme.colors.mintHigh,
    text: theme.colors.textPrimary,
  },
  amber: {
    background: "#7B6746",
    border: theme.colors.amberHigh,
    text: theme.colors.textPrimary,
  },
  coral: {
    background: "#825861",
    border: theme.colors.coralHigh,
    text: theme.colors.textPrimary,
  },
  neutral: {
    background: theme.colors.surfaceMuted,
    border: theme.colors.borderStrong,
    text: theme.colors.textPrimary,
  },
} as const;

const styles = StyleSheet.create({
  base: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    shadowColor: "#171A28",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
  },
});
