import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "@/styles/tokens";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
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
    paddingTop: 112,
  },
  title: {
    fontSize: typography.size.hero,
    textAlign: "center",
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.inter,
    marginBottom: 48,
  },
  submitButton: {
    width: 152,
    alignSelf: "center",
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.size.bodySm,
    fontFamily: typography.fontFamily.inter,
    textAlign: "center",
    marginTop: 16,
  },
  bottomLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
  },
  link: {
    color: colors.accent,
    fontSize: typography.size.bodySm,
    fontFamily: typography.fontFamily.inter,
  },
});
