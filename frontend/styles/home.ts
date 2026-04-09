import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#0f172a",
    },
    scrollView: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "space-between",
        backgroundColor: "#0f172a",
    },
    content: {
        gap: 16,
        paddingTop: 24,
    },
    header: {
        gap: 8,
    },
    title: {
        color: "#f8fafc",
        fontSize: 42,
        fontWeight: "700",
    },
    subtitle: {
        color: "#94a3b8",
        fontSize: 18,
        lineHeight: 26,
    },
    featureCard: {
        backgroundColor: "#111827",
        borderRadius: 24,
        padding: 20,
        gap: 16,
        borderWidth: 1,
        borderColor: "#1f2937",
    },
    cardLabel: {
        color: "#cbd5e1",
        fontSize: 16,
    },
    cardTitle: {
        color: "#f8fafc",
        fontSize: 28,
        fontWeight: "600",
    },
    cardText: {
        color: "#94a3b8",
        lineHeight: 22,
    },
    cardRow: {
        flexDirection: "row",
        gap: 12,
        flexWrap: "wrap",
    },
    miniCard: {
        flexBasis: "48%",
        backgroundColor: "#1e293b",
        borderRadius: 18,
        padding: 16,
    },
    miniCardTitle: {
        color: "#f8fafc",
        fontSize: 20,
        fontWeight: "600",
    },
    miniCardText: {
        color: "#94a3b8",
        marginTop: 6,
    },
    buttonContainer: {
        gap: 12,
        paddingBottom: 24,
    },
});