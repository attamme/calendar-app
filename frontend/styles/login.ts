import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  pressable: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 34,
    paddingTop: 77,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    color: "#111111",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#111111",
    marginBottom: 40,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 21,
    marginBottom: 40,
  },
  socialBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
  },
  socialBadgeText: {
    fontSize: 24,
    color: "#000000",
  },
  guestLink: {
    color: "#6A5AFC",
    fontSize: 14,
  },
  errorText: {
    color: "#B3261E",
    fontSize: 14,
    marginBottom: 20,
  },
  link: {
    color: "#6A5AFC",
    fontSize: 16,
    textDecorationLine: "underline",
    marginBottom: 10,
  },
});
