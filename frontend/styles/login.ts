import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "@/styles/tokens";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundOrbLarge: {
    position: "absolute",
    width: 284,
    height: 284,
    borderRadius: 142,
    backgroundColor: colors.patternSecondary,
    bottom: -74,
    left: 80,
  },
  backgroundOrbSmall: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.patternPrimary,
    bottom: -18,
    left: 122,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  screen: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 21,
    paddingTop: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: 24,
    lineHeight: 24,
    fontFamily: typography.fontFamily.inter,
  },
  logoTouchTarget: {
    paddingTop: 0,
    paddingLeft: 0,
  },
  topBarSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 34,
    paddingTop: 38,
    paddingBottom: 32,
  },
  title: {
    fontSize: typography.size.title,
    lineHeight: typography.lineHeight.bodyLg,
    textAlign: "center",
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.inter,
    marginBottom: 14,
  },
  subtitle: {
    fontSize: typography.size.bodySm,
    lineHeight: 20,
    textAlign: "center",
    color: colors.textMuted,
    fontFamily: typography.fontFamily.inter,
    marginBottom: 34,
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
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  socialBadgeText: {
    fontSize: 24,
    color: "#4285F4",
    fontFamily: typography.fontFamily.inter,
  },
  guestLink: {
    color: colors.textSecondary,
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
    color: colors.textSecondary,
    fontSize: typography.size.bodySm,
    fontFamily: typography.fontFamily.inter,
    textDecorationLine: "underline",
    marginBottom: 6,
  },
});
