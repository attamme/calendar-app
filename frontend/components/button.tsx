import { StyleProp, Text, TouchableOpacity, ViewStyle } from "react-native";
import { styles } from "@/styles/button";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: "primary" | "secondary";
};

export default function Button({
  title,
  onPress,
  style,
  variant = "primary",
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.container, variant === "secondary" ? styles.secondary : styles.primary, style]}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}
