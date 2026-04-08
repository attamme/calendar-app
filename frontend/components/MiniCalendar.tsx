import { ReactNode } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Href, useRouter } from "expo-router";
import { styles } from "@/styles/mini_calendar";
import { colors } from "@/styles/colors";

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
};

export default function MiniCalendar({
    label,
    destination,
    strokeColor = colors.link,
    cellIcons = [],
    onPress,
}: Props) {
    const router = useRouter();

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
            style={({ pressed }) => [styles.calendar, pressed && styles.calendarPressed]}
        >
            <View style={[styles.calendarFrame, { borderColor: strokeColor }]} />
            {CELL_POSITIONS.map((position, index) => (
                <View key={`${label}-${index}`} style={[styles.cell, position]}>
                    {cellIcons[index]}
                </View>
            ))}
            <Text style={styles.name}>{label}</Text>
        </Pressable>
    );
}