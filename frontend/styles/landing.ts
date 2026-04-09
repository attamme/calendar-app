import { StyleSheet } from "react-native";
import { colors, radius, shadows, spacing, typography } from "@/styles/tokens";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.authGutter,
    paddingTop: 18,
    paddingBottom: 32,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.size.title,
    lineHeight: typography.lineHeight.bodyLg,
    fontFamily: typography.fontFamily.inter,
    marginTop: 40,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.size.bodyLg,
    lineHeight: typography.lineHeight.bodyLg,
    fontFamily: typography.fontFamily.inter,
    marginBottom: 35,
  },
  heroImage: {
    width: "100%",
    height: 168,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.card,
    marginBottom: 57,
    opacity: 0.45,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.title,
    lineHeight: typography.lineHeight.bodyLg,
    fontFamily: typography.fontFamily.inter,
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
    color: colors.textSecondary,
    fontSize: typography.size.bodyLg,
    lineHeight: typography.lineHeight.roomy,
    fontFamily: typography.fontFamily.inter,
    paddingRight: 20,
  },
  helpButton: {
    position: "absolute",
    right: -29,
    bottom: -29,
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.floating,
  },
  helpButtonText: {
    color: colors.white,
    fontSize: typography.size.display,
    fontFamily: typography.fontFamily.balsamiqBold,
    transform: [{ rotate: "30deg" }],
  },
});
