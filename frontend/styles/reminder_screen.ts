import { StyleSheet } from "react-native";
import { colors, radius, typography } from "@/styles/tokens";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 21,
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    marginBottom: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.size.title,
    lineHeight: typography.lineHeight.bodyLg,
    fontFamily: typography.fontFamily.inter,
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 24,
  },
  multilineCard: {
    minHeight: 212,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 14,
  },
  fieldLabel: {
    color: colors.textPrimary,
    fontSize: typography.size.body,
    lineHeight: typography.lineHeight.body,
    fontFamily: typography.fontFamily.inter,
  },
  sectionLabel: {
    color: colors.textPrimary,
    fontSize: typography.size.body,
    lineHeight: typography.lineHeight.body,
    fontFamily: typography.fontFamily.inter,
    marginBottom: 10,
  },
  pillRow: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.input,
    minHeight: 54,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 15,
  },
  pillText: {
    color: colors.textPrimary,
    fontSize: typography.size.body,
    lineHeight: typography.lineHeight.body,
    fontFamily: typography.fontFamily.inter,
  },
  priorityBadge: {
    width: 33,
    height: 33,
    borderRadius: 17,
    backgroundColor: "#FF8E84",
    alignItems: "center",
    justifyContent: "center",
  },
});
