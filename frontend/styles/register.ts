import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: 24,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: "center",
        paddingBottom: 40
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        margin: 16
    },
    mainText: {
        color: colors.text,
        fontSize: 24,
        textAlign: "center",
        marginTop: 40
    },
    subText: {
        color: colors.subtext,
        fontSize: 16,
        textAlign: "center",
        marginTop: 11
    },
    bottomLinks: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30
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