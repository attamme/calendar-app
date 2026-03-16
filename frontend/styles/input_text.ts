import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        color: colors.blue,
        fontSize: 14,
        fontWeight: 500,
        marginVertical: 8
    },
    inputContainer: {
        borderRadius: 14,
        borderColor: colors.grey,
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        flex: 1
    },
    eye: {
        width: 24,
        height: 24,
        marginHorizontal: 16
    }
})