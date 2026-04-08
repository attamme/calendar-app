import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";

type MetricCardProps = {
  label: string;
  value: number;
  tone?: "accent" | "mint" | "amber" | "coral";
};

export default function MetricCard({ label, value, tone = "accent" }: MetricCardProps) {
  const palette = palettes[tone];

  return (
    <View style={[styles.card, { backgroundColor: palette.background }]}>
      <Text style={[styles.value, { color: palette.value }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const palettes = {
  accent: { background: theme.colors.accentSoft, value: theme.colors.accent },
  mint: { background: theme.colors.mintSoft, value: theme.colors.mint },
  amber: { background: theme.colors.amberSoft, value: "#9A6800" },
  coral: { background: theme.colors.coralSoft, value: theme.colors.coral },
} as const;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 104,
    padding: 16,
    borderRadius: 20,
    gap: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: "800",
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
  },
});
