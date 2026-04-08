import { Alert, Pressable, Text, View } from "react-native";
import { Href, useRouter } from "expo-router";
import { styles } from "@/styles/mini_calendar";
import { colors } from "@/styles/colors";

type Props = {
    label: string;
    destination?: Href;
    strokeColor?: string;
    onPress?: (label: string) => void;
};

export default function MiniCalendar({
    label,
    destination,
    strokeColor = colors.link,
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
            <View style={[styles.calendarChild, { borderColor: strokeColor }]} />
            <View style={[styles.calendarItem, styles.container]} />
            <View style={[styles.calendarInner, styles.container]} />
            <View style={[styles.rectangleView, styles.view]} />
            <View style={[styles.calendarChild2, styles.view]} />
            <Text style={styles.name}>{label}</Text>
        </Pressable>
    );
}