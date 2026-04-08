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
          backgroundColor: selected ? palette.background : theme.colors.surface,
          borderColor: selected ? palette.border : theme.colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: selected ? palette.text : theme.colors.textSecondary },
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
    background: theme.colors.accentSoft,
    border: theme.colors.accent,
    text: theme.colors.accent,
  },
  mint: {
    background: theme.colors.mintSoft,
    border: theme.colors.mint,
    text: theme.colors.mint,
  },
  amber: {
    background: theme.colors.amberSoft,
    border: theme.colors.amber,
    text: "#8C6400",
  },
  coral: {
    background: theme.colors.coralSoft,
    border: theme.colors.coral,
    text: theme.colors.coral,
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
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
  },
});
