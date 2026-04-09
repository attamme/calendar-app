import { StyleSheet } from "react-native";
import { colors, radius, typography } from "@/styles/tokens";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.size.bodySm,
    fontFamily: typography.fontFamily.inter,
    marginBottom: 8,
  },
  inputContainer: {
    minHeight: 48,
    borderRadius: radius.input,
    backgroundColor: colors.surfaceMuted,
    paddingRight: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.inter,
  },
  eye: {
    width: 20,
    height: 20,
    color: colors.textMuted,
  },
});
