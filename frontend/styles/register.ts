import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "@/styles/tokens";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundOrbLarge: {
    position: "absolute",
    width: 304,
    height: 304,
    borderRadius: 152,
    backgroundColor: colors.patternSecondary,
    bottom: -88,
    left: 74,
  },
  backgroundOrbSmall: {
    position: "absolute",
    width: 224,
    height: 224,
    borderRadius: 112,
    backgroundColor: colors.patternPrimary,
    bottom: -24,
    left: 110,
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
    paddingHorizontal: 38,
    paddingTop: 30,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.inter,
    marginBottom: 36,
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
    color: colors.textSecondary,
    fontSize: typography.size.bodySm,
    fontFamily: typography.fontFamily.inter,
  },
});
