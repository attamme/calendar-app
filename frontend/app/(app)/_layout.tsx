import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { theme } from "@/theme/tokens";

export default function AppTabsLayout() {
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
    </Tabs>
  );
}
