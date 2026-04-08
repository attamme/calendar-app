import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
    container: {
        width: 35,
        height: 35,
        backgroundColor: colors.fourth,
        top: 29,
        borderRadius: 14,
        position: "absolute",
    },
    view: {
        top: 69,
        height: 35,
        width: 35,
        backgroundColor: colors.fourth,
        borderRadius: 14,
        position: "absolute",
    },
    calendar: {
        width: 98,
        height: 116,
        position: "relative",
    },
    calendarPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    calendarChild: {
        top: 18,
        backgroundColor: colors.third,
        borderStyle: "solid",
        borderColor: colors.link,
        borderWidth: 2,
        width: 98,
        height: 98,
        borderRadius: 14,
        left: 0,
        position: "absolute",
    },
    calendarItem: {
        left: 10,
    },
    calendarInner: {
        left: 52,
    },
    rectangleView: {
        left: 10,
    },
    calendarChild2: {
        left: 52,
    },
    name: {
        top: 0,
        fontSize: 12,
        fontFamily: "Inter-Regular",
        color: colors.text,
        textAlign: "center",
        width: 98,
        height: 20,
        left: 0,
        position: "absolute",
    },
});