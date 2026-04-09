import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";

import { useAuth } from "@/providers/AuthProvider";
import { theme } from "@/theme/tokens";

export default function AppTabsLayout() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator color={theme.colors.accentHigh} size="large" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/landing-page" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.surface,
          height: 67,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontWeight: "500",
          fontSize: 12,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Focus",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="view-dashboard-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendars"
        options={{
          title: "Calendars",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="calendar-month-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="account-group-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="quick-capture"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="calendar-center"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="friend-search"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
