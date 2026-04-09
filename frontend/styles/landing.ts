import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 37,
    paddingTop: 18,
    paddingBottom: 32,
  },
  title: {
    color: "#111111",
    fontSize: 24,
    marginTop: 40,
    marginBottom: 8,
  },
  subtitle: {
    color: "#696969",
    fontSize: 20,
    marginBottom: 35,
  },
  heroImage: {
    width: "100%",
    height: 168,
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    marginBottom: 57,
    opacity: 0.45,
  },
  sectionTitle: {
    color: "#111111",
    fontSize: 24,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
  },
  description: {
    color: "#696969",
    fontSize: 20,
    lineHeight: 34,
    paddingRight: 20,
  },
  helpButton: {
    position: "absolute",
    right: -29,
    bottom: -29,
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: "#6A5AFC",
    alignItems: "center",
    justifyContent: "center",
  },
  helpButtonText: {
    color: "#FFFFFF",
    fontSize: 48,
    transform: [{ rotate: "30deg" }],
  },
});
