import { StyleSheet } from "react-native";
import { colors, radius, shadows, spacing, typography } from "@/styles/tokens";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundOrbLarge: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.patternPrimary,
    bottom: 42,
    left: 64,
  },
  backgroundOrbSmall: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.patternSecondary,
    bottom: -20,
    left: 150,
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
    marginTop: 34,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.size.body,
    lineHeight: typography.lineHeight.body,
    fontFamily: typography.fontFamily.inter,
    marginBottom: 35,
  },
  heroCard: {
    borderRadius: radius.card,
    overflow: "hidden",
    marginBottom: 52,
    ...shadows.floating,
  },
  heroImage: {
    width: "100%",
    height: 168,
    backgroundColor: colors.surfaceMuted,
    opacity: 0.78,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(71, 78, 104, 0.32)",
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
    fontSize: typography.size.body,
    lineHeight: 22,
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
