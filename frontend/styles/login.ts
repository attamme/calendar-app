import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingTop: 18,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16
    },
    mainText: {
        color: colors.text,
        fontSize: 24,
        textAlign: "center",
        marginTop: 206
    },
    subText: {
        color: colors.subtext,
        fontSize: 16,
        textAlign: "center",
        marginTop: 11
    },
    link: {
        color: colors.link,
        fontSize: 14,
    },
    agreeRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    agreeText: {
        color: colors.subtext,
        marginHorizontal: 14,
        fontSize: 14
    },
    agreeTextBold: {
        fontWeight: 700
    },
    submitButton: {
        marginTop: 16
    }
})