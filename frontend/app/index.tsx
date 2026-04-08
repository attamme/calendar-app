import { Redirect } from "expo-router";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { useAuth } from "@/providers/AuthProvider";
import { theme } from "@/theme/tokens";

export default function Index() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingTitle}>Building your focus dashboard</Text>
          <Text style={styles.loadingText}>
            Loading tasks, reminders, and shared plans.
          </Text>
          <ActivityIndicator color={theme.colors.accent} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (user) {
    return <Redirect href="/(app)/dashboard" />;
  }

  return <Redirect href="/(auth)/landing-page" />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingCard: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    padding: 28,
    gap: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  loadingTitle: {
    color: theme.colors.textPrimary,
    fontSize: 26,
    fontWeight: "800",
  },
  loadingText: {
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
});
