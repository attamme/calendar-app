import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";

type HiFiHeaderProps = {
  title: string;
  leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onLeftPress?: () => void;
  rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onRightPress?: () => void;
};

export default function HiFiHeader({
  title,
  leftIcon = "chevron-left",
  onLeftPress,
  rightIcon,
  onRightPress,
}: HiFiHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        disabled={!onLeftPress}
        onPress={onLeftPress}
        style={[styles.iconButton, !onLeftPress && styles.iconGhost]}
      >
        <MaterialCommunityIcons color={theme.colors.textPrimary} name={leftIcon} size={28} />
      </Pressable>

      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>

      {rightIcon ? (
        <Pressable accessibilityRole="button" onPress={onRightPress} style={styles.iconButton}>
          <MaterialCommunityIcons color={theme.colors.textPrimary} name={rightIcon} size={28} />
        </Pressable>
      ) : (
        <View style={styles.iconButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  iconGhost: {
    opacity: 0.75,
  },
  title: {
    flex: 1,
    color: theme.colors.textPrimary,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    letterSpacing: 3,
  },
});
