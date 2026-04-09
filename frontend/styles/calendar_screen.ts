import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "@/styles/tokens";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    height: 56,
    backgroundColor: colors.surfaceRaised,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.size.bodyLg,
    lineHeight: typography.lineHeight.body,
    fontFamily: typography.fontFamily.balsamiq,
    flex: 1,
  },
  topActions: {
    flexDirection: "row",
    gap: 24,
  },
  topActionText: {
    color: colors.textSecondary,
    fontSize: typography.size.bodySm,
    lineHeight: typography.lineHeight.body,
    fontFamily: typography.fontFamily.balsamiq,
  },
  tasksSection: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  tasksHeading: {
    color: colors.textPrimary,
    fontSize: typography.size.bodyLg,
    lineHeight: typography.lineHeight.body,
    fontFamily: typography.fontFamily.balsamiq,
    textAlign: "center",
    marginBottom: 10,
  },
  taskStrip: {
    flexDirection: "row",
    gap: 10,
  },
  taskCard: {
    height: 88,
    borderRadius: 4,
    backgroundColor: colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  taskCardWide: {
    width: 102,
  },
  taskCardNarrow: {
    width: 48,
  },
  taskCardText: {
    color: colors.textPrimary,
    fontSize: typography.size.body,
    lineHeight: typography.lineHeight.body,
    fontFamily: typography.fontFamily.balsamiq,
    textAlign: "center",
  },
  calendarSection: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    paddingTop: spacing.sm,
  },
  bottomNav: {
    height: 67,
    backgroundColor: colors.surfaceRaised,
    flexDirection: "row",
    alignItems: "center",
  },
  bottomSegment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  bottomLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: typography.fontFamily.balsamiq,
  },
  bottomLabelActive: {
    color: colors.accentSoft,
  },
});
