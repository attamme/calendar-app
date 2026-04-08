import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
    calendar: {
        width: "100%",
        maxWidth: 391,
        minHeight: 401,
        backgroundColor: colors.primary,
        padding: 10,
        alignSelf: "center",
    },
    monthLabel: {
        color: colors.text,
        fontSize: 20,
        lineHeight: 24,
        fontFamily: "Inter-Regular",
        alignSelf: "flex-start",
        minHeight: 29,
        paddingBottom: 1,
    },
    weekdaysRow: {
        flexDirection: "row",
        gap: 10,
        height: 57,
        width: "100%",
        backgroundColor: colors.second,
        padding: 10,
        alignItems: "center",
    },
    weekdayCell: {
        flex: 1,
        minWidth: 0,
        height: "100%",
        backgroundColor: colors.third,
        borderRadius: 3,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    weekdayText: {
        color: colors.subtext,
        fontSize: 16,
        lineHeight: 24,
        fontFamily: "Inter-Regular",
        textAlign: "center",
    },
    weekendText: {
        color: "#ff0000",
    },
    weekRow: {
        flexDirection: "row",
        flex: 1,
        gap: 10,
        width: "100%",
        backgroundColor: colors.second,
        padding: 10,
        minHeight: 57,
        alignItems: "center",
        position: "relative",
    },
    dayCell: {
        backgroundColor: colors.third,
        borderRadius: 3,
        borderWidth: 0,
        borderColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
    },
    emptyDayCell: {
        backgroundColor: "transparent",
        borderRadius: 3,
    },
    firstDayCell: {
        borderWidth: 1,
        borderColor: colors.text,
    },
    selectedDayCell: {
        borderWidth: 2,
        borderColor: "#6A5AFC",
    },
    dayCellPressed: {
        opacity: 0.9,
    },
    dayText: {
        color: colors.subtext,
        fontSize: 20,
        lineHeight: 24,
        fontFamily: "Inter-Regular",
        textAlign: "center",
        width: "100%",
    },
});
