import { StyleSheet } from "react-native";
import { colors, radius, typography } from "@/styles/tokens";

export const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.actionNeutral,
  },
  title: {
    color: colors.white,
    fontSize: typography.size.body,
    fontFamily: typography.fontFamily.inter,
  },
});
