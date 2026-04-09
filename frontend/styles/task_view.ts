import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        maxWidth: 393,
    },
    card: {
        backgroundColor: colors.second,
        borderRadius: 10,
        paddingTop: 14,
        paddingBottom: 12,
        paddingHorizontal: 21,
        minHeight: 179,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginRight: 12,
    },
    priorityPill: {
        marginLeft: -21,
        marginTop: -19,
        width: 28,
        height: 28,
        transform: [{ rotate: "90deg" }],
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        marginRight: 25,
    },
    title: {
        color: colors.text,
        fontSize: 16,
        flexShrink: 1,
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 2,
    },
    statusBar: {
        width: 9,
        height: 25,
        borderRadius: 15,
        marginLeft: 6,
    },
    contentRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    navButton: {
        width: 28,
        alignItems: "center",
        justifyContent: "center",
    },
    navText: {
        color: colors.fourth,
        fontSize: 38,
        lineHeight: 42,
        fontWeight: "300",
    },
    description: {
        flex: 1,
        color: colors.subtext,
        fontSize: 14,
        lineHeight: 24,
        marginHorizontal: 8,
    },
    handle: {
        width: 86,
        height: 4,
        borderRadius: 50,
        backgroundColor: colors.line,
        alignSelf: "center",
        marginTop: 12,
    },
    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
        paddingHorizontal: 21,
    },
    actionButton: {
        width: 95,
        paddingVertical: 14,
        marginVertical: 0,
        paddingHorizontal: 0,
    },
    deleteButton: {
        backgroundColor: colors.second,
    },
    editButton: {
        backgroundColor: colors.third,
    },
    finishButton: {
        backgroundColor: colors.loginbtn,
    },
});
