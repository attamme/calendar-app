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
    paddingHorizontal: 38,
    paddingTop: 115,
  },
  title: {
    fontSize: 36,
    textAlign: "center",
    color: "#111111",
    marginBottom: 48,
  },
  submitButton: {
    width: 152,
    alignSelf: "center",
    marginTop: 5,
  },
  errorText: {
    color: "#B3261E",
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
  },
  bottomLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
  },
  link: {
    color: "#6A5AFC",
    fontSize: 14,
  },
});
