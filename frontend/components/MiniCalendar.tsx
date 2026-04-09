import { ReactNode } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Href, useRouter } from "expo-router";
import { styles } from "@/styles/mini_calendar";
import { colors } from "@/styles/tokens";

const CELL_POSITIONS = [
    { top: 29, left: 10 },
    { top: 29, left: 52 },
    { top: 69, left: 10 },
    { top: 69, left: 52 },
] as const;

type Props = {
  label: string;
  destination?: Href;
  strokeColor?: string;
  cellIcons?: ReactNode[];
  onPress?: (label: string) => void;
  variant?: "default" | "dashboard";
  selected?: boolean;
};

export default function MiniCalendar({
  label,
  destination,
  strokeColor = colors.accent,
  cellIcons = [],
  onPress,
  variant = "default",
  selected = false,
}: Props) {
  const router = useRouter();
  const isDashboard = variant === "dashboard";

  const handlePress = () => {
    if (onPress) {
      onPress(label);
      return;
    }

    if (destination) {
      router.push(destination);
      return;
    }

    Alert.alert("Calendar", `You are trying to go to ${label} page.`);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${label} calendar`}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.calendar,
        isDashboard && styles.dashboardCalendar,
        pressed && styles.calendarPressed,
      ]}
    >
      <View
        style={[
          styles.calendarFrame,
          isDashboard ? styles.dashboardFrame : styles.defaultFrame,
          !isDashboard && { borderColor: strokeColor },
          selected && isDashboard && styles.dashboardFrameSelected,
        ]}
      />
      {CELL_POSITIONS.map((position, index) => (
        <View
          key={`${label}-${index}`}
          style={[
            styles.cell,
            position,
            isDashboard ? styles.dashboardCell : styles.defaultCell,
            selected && isDashboard && styles.dashboardCellSelected,
          ]}
        >
          {cellIcons[index]}
        </View>
      ))}
      <Text style={[styles.name, isDashboard ? styles.dashboardName : styles.defaultName]}>{label}</Text>
    </Pressable>
  );
}
