import { StyleSheet } from "react-native";
import { colors, radius, typography } from "./tokens";

export const styles = StyleSheet.create({
  cell: {
    height: 35,
    width: 35,
    borderRadius: 14,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  defaultCell: {
    backgroundColor: colors.homeTileInner,
  },
  dashboardCell: {
    backgroundColor: colors.homeTileInner,
  },
  dashboardCellSelected: {
    backgroundColor: colors.homeSelection,
  },
  calendar: {
    width: 98,
    height: 116,
    position: "relative",
  },
  dashboardCalendar: {
    width: 98,
    height: 116,
  },
  calendarPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  calendarFrame: {
    top: 18,
    width: 98,
    height: 98,
    left: 0,
    position: "absolute",
    borderRadius: 14,
  },
  defaultFrame: {
    backgroundColor: colors.homeCard,
    borderStyle: "solid",
    borderWidth: 2,
  },
  dashboardFrame: {
    backgroundColor: colors.homeTile,
  },
  dashboardFrameSelected: {
    backgroundColor: colors.homeCard,
  },
  name: {
    top: 0,
    width: 98,
    height: 20,
    left: 0,
    position: "absolute",
    textAlign: "center",
    fontSize: 12,
    lineHeight: 20,
    fontFamily: typography.fontFamily.inter,
  },
  defaultName: {
    color: colors.textPrimary,
  },
  dashboardName: {
    color: colors.textPrimary,
  },
});
