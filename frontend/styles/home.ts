import { StyleSheet } from "react-native";
import { colors, typography } from "./tokens";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.background,
  },
  sidebar: {
    width: 74,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    paddingTop: 29,
  },
  menuIcon: {
    width: 25,
    gap: 7,
    alignItems: "center",
    marginBottom: 33,
  },
  menuLine: {
    width: 25,
    height: 3,
    borderRadius: 999,
    backgroundColor: colors.white,
  },
  avatarColumn: {
    gap: 27,
    marginBottom: 27,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.homeTile,
  },
  sidebarActions: {
    gap: 27,
  },
  selectionButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.homeTile,
    alignItems: "center",
    justifyContent: "center",
  },
  selectionInner: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.homeSelection,
    opacity: 0.21,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.homeTile,
    alignItems: "center",
    justifyContent: "center",
  },
  addLineVertical: {
    position: "absolute",
    width: 5,
    height: 32,
    borderRadius: 999,
    backgroundColor: colors.homeSelection,
  },
  addLineHorizontal: {
    position: "absolute",
    width: 32,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.homeSelection,
  },
  main: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 82,
    backgroundColor: colors.homeHeader,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.size.body,
    color: colors.textPrimary,
  },
  content: {
    paddingTop: 23,
    paddingHorizontal: 10,
  },
  categoryPanel: {
    height: 69,
    borderRadius: 22,
    backgroundColor: colors.surfaceMuted,
    marginBottom: 31,
    justifyContent: "center",
    paddingHorizontal: 19,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryChip: {
    width: 104,
    height: 24,
    borderRadius: 22,
    backgroundColor: colors.homeChip,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryChipSelected: {
    backgroundColor: colors.homeCard,
  },
  categoryText: {
    fontFamily: typography.fontFamily.inter,
    fontSize: 12,
    color: colors.textPrimary,
  },
  hashText: {
    position: "absolute",
    alignSelf: "center",
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.size.title,
    color: colors.textPrimary,
    opacity: 0.5,
  },
  todayCard: {
    width: "100%",
    height: 98,
    borderRadius: 14,
    backgroundColor: colors.homeCard,
    marginBottom: 25,
    paddingTop: 8,
    paddingHorizontal: 10,
  },
  todayLabel: {
    fontFamily: typography.fontFamily.inter,
    fontSize: 12,
    color: colors.white,
  },
  calendarRow: {
    flexDirection: "row",
    gap: 25,
  },
});
