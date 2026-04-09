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
    paddingHorizontal: 34,
    paddingTop: 77,
  },
  title: {
    fontSize: typography.size.title,
    lineHeight: typography.lineHeight.bodyLg,
    textAlign: "center",
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.inter,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: typography.size.body,
    lineHeight: 24,
    textAlign: "center",
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.inter,
    marginBottom: 40,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    marginTop: spacing.sm,
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
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  socialBadgeText: {
    fontSize: 24,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.inter,
  },
  guestLink: {
    color: colors.accent,
    fontSize: typography.size.bodySm,
    fontFamily: typography.fontFamily.inter,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.size.bodySm,
    fontFamily: typography.fontFamily.inter,
    marginBottom: 20,
  },
  link: {
    color: colors.accent,
    fontSize: typography.size.body,
    fontFamily: typography.fontFamily.inter,
    textDecorationLine: "underline",
    marginBottom: 10,
  },
});
