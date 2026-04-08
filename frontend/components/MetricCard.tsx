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
    <View style={[styles.card, { backgroundColor: palette.background, borderColor: palette.border }]}>
      <Text style={[styles.value, { color: palette.value }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const palettes = {
  accent: { background: "#56638D", border: "#AEB7FF", value: "#FFFFFF" },
  mint: { background: "#486A63", border: "#D9FF82", value: "#F7FFDE" },
  amber: { background: "#7B6440", border: "#FFD68C", value: "#FFF3D9" },
  coral: { background: "#7D575C", border: "#FF9DA0", value: "#FFE6E7" },
} as const;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 104,
    padding: 16,
    borderRadius: 20,
    gap: 8,
    borderWidth: 2,
  },
  value: {
    fontSize: 28,
    fontWeight: "800",
  },
  label: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
});
