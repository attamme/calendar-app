import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        paddingTop: 18,
    },
    agreeRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    agreeText: {
        color: colors.blue,
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