import { useRouter } from "expo-router";
import { startTransition, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import Button from "@/components/button";
import Chip from "@/components/Chip";
import HiFiHeader from "@/components/HiFiHeader";
import InputText from "@/components/InputText";
import { useAuth } from "@/providers/AuthProvider";
import { usePlannerSync } from "@/providers/PlannerSyncProvider";
import { addFriend } from "@/services/api";
import { theme } from "@/theme/tokens";

const suggestedIdeas = [
  "Study partner",
  "Project teammate",
  "Roommate",
  "Coach",
];

export default function FriendSearchScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { notifyPlannerChanged } = usePlannerSync();

  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function exitScreen() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(app)/friends");
  }

  async function handleAddFriend() {
    if (!token) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      await addFriend(username, token);
      startTransition(() => {
        setUsername("");
      });
      notifyPlannerChanged();
      exitScreen();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to add friend");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <HiFiHeader
          leftIcon="chevron-left"
          onLeftPress={exitScreen}
          title="Add friend"
        />

        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Shared planning</Text>
          <Text style={styles.heroTitle}>Add the person before you start sharing plans.</Text>
          <Text style={styles.heroText}>
            Once the connection exists, shared calendars and one-off events stay much easier to manage.
          </Text>
        </View>

        <View style={styles.panel}>
          <InputText
            autoCapitalize="none"
            label="Username or email"
            onChangeText={setUsername}
            placeholder="Type a username or email"
            value={username}
          />

          <View style={styles.group}>
            <Text style={styles.groupLabel}>Common use cases</Text>
            <View style={styles.chipRow}>
              {suggestedIdeas.map((idea) => (
                <Chip key={idea} label={idea} selected tone="neutral" />
              ))}
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            disabled={!username.trim()}
            loading={saving}
            onPress={handleAddFriend}
            title="Add friend"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 20,
    gap: 18,
    paddingBottom: 36,
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 20,
    gap: 8,
  },
  heroEyebrow: {
    color: theme.colors.accentHigh,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: theme.colors.textPrimary,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },
  heroText: {
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  panel: {
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 20,
    gap: 18,
  },
  group: {
    gap: 10,
  },
  groupLabel: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  errorText: {
    color: theme.colors.coralHigh,
    fontWeight: "700",
    lineHeight: 20,
  },
});
