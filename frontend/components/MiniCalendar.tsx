import { View, Text } from "react-native";
import { styles } from "@/styles/mini_calendar";

type Props = {
    label: string;
}

export default function MiniCalendar ({ label } : Props ) {
    return (
        <View style={styles.calendar}>
            <View style={styles.calendarChild} />
            <View style={[styles.calendarItem, styles.container]} />
            <View style={[styles.calendarInner, styles.container]} />
            <View style={[styles.rectangleView, styles.view]} />
            <View style={[styles.calendarChild2, styles.view]} />
            <Text style={styles.name}>{label}</Text>
        </View>
    )
}