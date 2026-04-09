import { StyleSheet } from "react-native";
import { colors, typography } from "@/styles/tokens";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 7,
    paddingTop: 13,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  closeButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  dateLabel: {
    color: colors.textPrimary,
    fontSize: typography.size.bodyLg,
    lineHeight: typography.lineHeight.body,
    fontFamily: typography.fontFamily.balsamiq,
  },
  section: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.bodyLg,
    lineHeight: typography.lineHeight.body,
    fontFamily: typography.fontFamily.balsamiq,
    textAlign: "center",
    marginBottom: 10,
  },
  itemList: {
    gap: 10,
  },
  itemCard: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  itemText: {
    color: colors.textPrimary,
    fontSize: typography.size.body,
    lineHeight: typography.lineHeight.body,
    fontFamily: typography.fontFamily.balsamiq,
  },
  itemMeta: {
    color: colors.textMuted,
    fontSize: typography.size.bodySm,
    lineHeight: typography.lineHeight.compact,
    fontFamily: typography.fontFamily.inter,
    marginTop: 4,
  },
  addRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addText: {
    color: colors.textPrimary,
    fontSize: typography.size.body,
    lineHeight: typography.lineHeight.body,
    fontFamily: typography.fontFamily.balsamiq,
  },
});
