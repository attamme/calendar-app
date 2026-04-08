import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
    cell: {
        height: 35,
        width: 35,
        backgroundColor: colors.fourth,
        borderRadius: 14,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
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
    calendarFrame: {
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