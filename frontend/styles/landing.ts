import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4d5272",
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 24,
  },
  logo: {
    width: 34,
    height: 34,
    marginBottom: 28,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
  },
  subtitle: {
    color: "#e6e6ee",
    fontSize: 14,
    marginBottom: 24,
  },
  heroImage: {
    width: "100%",
    height: 130,
    borderRadius: 4,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 14,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 22,
  },
  description: {
    color: "#f1f1f1",
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 260,
  },
});