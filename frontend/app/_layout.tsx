import { Stack, type ErrorBoundaryProps } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import Button from "@/components/button";
import { AuthProvider } from "@/providers/AuthProvider";
import { PlannerSyncProvider } from "@/providers/PlannerSyncProvider";
import { theme } from "@/theme/tokens";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Something went wrong</Text>
        <Text style={styles.title}>The app hit a screen error instead of silently closing.</Text>
        <Text numberOfLines={8} style={styles.message}>
          {error.message || "Unknown app error"}
        </Text>
        <Button onPress={retry} title="Try again" />
      </View>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PlannerSyncProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
          <Stack.Screen
            name="planner-item/[id]"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
        </Stack>
      </PlannerSyncProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 20,
    gap: 14,
  },
  eyebrow: {
    color: theme.colors.coral,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 31,
  },
  message: {
    color: theme.colors.textSecondary,
    lineHeight: 21,
  },
});
