import { StyleProp, Text, TouchableOpacity, ViewStyle } from "react-native";
import { styles } from "@/styles/button";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: "primary" | "secondary";
  testID?: string;
};

export default function Button({
  title,
  onPress,
  style,
  variant = "primary",
  testID,
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      testID={testID}
      style={[styles.container, variant === "secondary" ? styles.secondary : styles.primary, style]}
    >
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
