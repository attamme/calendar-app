import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import Button from "@/components/button";
import ScreenShell from "@/components/ScreenShell";
import { theme } from "@/theme/tokens";

const featureRows = [
  {
    icon: "lightning-bolt-outline",
    title: "Quick capture for ADHD brains",
    text: "Add a task before it disappears, then sort it into today, next up, overdue, or easy wins.",
  },
  {
    icon: "bell-ring-outline",
    title: "Reminders that respect time blindness",
    text: "Store multiple reminders for one item so deadlines feel visible instead of sudden.",
  },
  {
    icon: "account-multiple-plus-outline",
    title: "Shared calendars and specific events",
    text: "Invite friends into a whole calendar or share only the event that actually matters.",
  },
];

export default function Landing() {
  const router = useRouter();

  return (
    <ScreenShell
      title="Plan with less overwhelm."
      subtitle="A student-friendly ADHD calendar for tasks, routines, reminders, and shared accountability."
      footer={
        <View style={styles.ctaRow}>
          <Button
            onPress={() => router.push("/(auth)/register")}
            style={styles.ctaButton}
            title="Create account"
          />
          <Button
            onPress={() => router.push("/(auth)/login")}
            style={styles.ctaButton}
            title="Log in"
            variant="secondary"
          />
        </View>
      }
    >
      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>ADHD-first organization</Text>
        <Text style={styles.heroTitle}>
          A planner that helps you see what matters right now.
        </Text>
        <Text style={styles.heroText}>
          Build calm structure around classes, work, routines, and shared plans without turning your day into a wall of stress.
        </Text>
      </View>

      {featureRows.map((feature) => (
        <View key={feature.title} style={styles.featureCard}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons color={theme.colors.accent} name={feature.icon as never} size={24} />
          </View>
          <View style={styles.featureCopy}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureText}>{feature.text}</Text>
          </View>
        </View>
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    padding: 22,
    borderRadius: 28,
    backgroundColor: theme.colors.backgroundStrong,
    gap: 12,
  },
  heroEyebrow: {
    color: theme.colors.accent,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    fontSize: 12,
  },
  heroTitle: {
    color: theme.colors.textPrimary,
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 34,
  },
  heroText: {
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  featureCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    gap: 14,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: theme.colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  featureCopy: {
    flex: 1,
    gap: 6,
  },
  featureTitle: {
    color: theme.colors.textPrimary,
    fontSize: 17,
    fontWeight: "800",
  },
  featureText: {
    color: theme.colors.textSecondary,
    lineHeight: 21,
  },
  ctaRow: {
    gap: 12,
  },
  ctaButton: {
    width: "100%",
  },
});
