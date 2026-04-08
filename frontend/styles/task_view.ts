import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const PRIORITY_COLORS = [
    "#FF8A00",
    "#FFB000",
    "#FFD400",
    "#F3FF2B",
    "#B7FF1A",
] as const;

export const styles = StyleSheet.create({
    card: {
        backgroundColor: "#4F5675",
        borderRadius: 24,
        paddingTop: 22,
        paddingHorizontal: 18,
        paddingBottom: 16,
        borderWidth: 1,
        borderColor: "rgba(213, 208, 255, 0.22)",
        overflow: "hidden",
        gap: 12,
    },
    cornerAccent: {
        position: "absolute",
        top: 0,
        left: 0,
        width: 52,
        height: 52,
        borderBottomRightRadius: 22,
        backgroundColor: "#FF3C45",
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 40,
        paddingRight: 4,
        marginBottom: 4,
    },
    title: {
        color: colors.text,
        fontSize: 40,
        lineHeight: 44,
        fontWeight: "600",
        letterSpacing: 0.5,
    },
    priorityRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    priorityPill: {
        width: 13,
        height: 40,
        borderRadius: 10,
    },
    priorityPillMuted: {
        backgroundColor: "rgba(255, 255, 255, 0.14)",
    },
    taskPagerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 8,
    },
    taskPagerPills: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        flexShrink: 1,
    },
    taskPagerPill: {
        height: 7,
        borderRadius: 999,
    },
    taskPagerPillActive: {
        width: 24,
    },
    taskPagerPillMuted: {
        width: 10,
        backgroundColor: "rgba(255, 255, 255, 0.22)",
    },
    taskPagerText: {
        color: "rgba(238, 238, 238, 0.7)",
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 0.2,
    },
    contentRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    navButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    navButtonDisabled: {
        opacity: 0.35,
    },
    descriptionTap: {
        flex: 1,
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 6,
    },
    description: {
        color: colors.subtext,
        fontSize: 18,
        lineHeight: 30,
        letterSpacing: 0.15,
    },
    footerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        paddingTop: 4,
    },
    helperRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        flexShrink: 1,
    },
    helperText: {
        color: "rgba(238, 238, 238, 0.72)",
        fontSize: 13,
    },
    doneButton: {
        backgroundColor: "rgba(130, 140, 178, 0.8)",
        paddingHorizontal: 22,
        paddingVertical: 10,
        borderRadius: 16,
        minWidth: 128,
        alignItems: "center",
    },
    doneButtonCompleted: {
        backgroundColor: "rgba(89, 77, 200, 0.95)",
    },
    doneButtonText: {
        color: colors.text,
        fontSize: 17,
        fontWeight: "500",
        letterSpacing: 0.2,
    },
});
