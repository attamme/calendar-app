import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { theme } from "@/theme/tokens";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  loading?: boolean;
};

export default function Button({
  title,
  onPress,
  style,
  textStyle,
  variant = "primary",
  disabled,
  loading,
}: ButtonProps) {
  const palette = palettes[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
        },
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.textColor} />
      ) : (
        <Text
          adjustsFontSizeToFit
          minimumFontScale={0.85}
          numberOfLines={1}
          style={[styles.text, { color: palette.textColor }, textStyle]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const palettes = {
  primary: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accentHigh,
    textColor: theme.colors.appTextInverse,
  },
  secondary: {
    backgroundColor: theme.colors.surfaceWarm,
    borderColor: theme.colors.borderStrong,
    textColor: theme.colors.appTextInverse,
  },
  ghost: {
    backgroundColor: theme.colors.backgroundStrong,
    borderColor: theme.colors.border,
    textColor: theme.colors.appTextInverse,
  },
} as const;

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#171A28",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.9,
    transform: [{ translateY: 1 }],
  },
  disabled: {
    opacity: 0.55,
  },
});
