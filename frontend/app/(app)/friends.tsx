import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Button from "@/components/button";
import HiFiHeader from "@/components/HiFiHeader";
import { useAuth } from "@/providers/AuthProvider";
import { fetchFriends } from "@/services/api";
import { theme } from "@/theme/tokens";
import type { FriendConnection } from "@/types/planner";
import { formatRelativeDate } from "@/utils/dates";

export default function FriendsScreen() {
  const router = useRouter();
  const { token, signOut } = useAuth();
  const isFocused = useIsFocused();

  const [friends, setFriends] = useState<FriendConnection[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  const suggestedPeople = useMemo(
    () => [
      { id: "suggest-1", username: "Study Buddy", detail: "Good for shared deadlines and catch-ups." },
      { id: "suggest-2", username: "Project Partner", detail: "Useful when one-off shared events happen often." },
    ],
    []
  );

  const loadFriends = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      setRefreshing(true);
      setError("");
      const response = await fetchFriends(token);
      startTransition(() => {
        setFriends(response.friends);
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to load friends");
    } finally {
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token || !isFocused) {
      return;
    }

    loadFriends();
  }, [token, isFocused, loadFriends]);

  async function handleSignOut() {
    try {
      setSigningOut(true);
      await signOut();
      router.replace("/(auth)/landing-page");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to sign out");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            onRefresh={loadFriends}
            refreshing={refreshing}
            tintColor={theme.colors.accent}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <HiFiHeader
          leftIcon="chevron-left"
          onLeftPress={() => router.push("/(app)/dashboard")}
          title="Friends"
        />

        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Shared planning</Text>
          <Text style={styles.heroTitle}>Keep people management separate from your focus flow.</Text>
          <Text style={styles.heroText}>
            Add friends, manage shared planning entry points, and then jump back to your actual work.
          </Text>
        </View>

        <View style={styles.actionPanel}>
          <View style={styles.sectionCopy}>
            <Text style={styles.sectionEyebrow}>Actions</Text>
            <Text style={styles.sectionTitle}>What do you need to do here?</Text>
            <Text style={styles.sectionText}>
              The heavier admin flows now live on their own pages so this screen stays easier to scan.
            </Text>
          </View>

          <View style={styles.actionStack}>
            <Button onPress={() => router.push("/(app)/friend-search")} title="Add friend" />
            <Button
              onPress={() => router.push("/(app)/calendar-center")}
              title="Open calendar center"
              variant="secondary"
            />
            <Button
              loading={signingOut}
              onPress={handleSignOut}
              title="Log out"
              variant="ghost"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Friends</Text>
          <View style={styles.friendList}>
            {friends.length ? (
              friends.map((friend) => (
                <View key={friend.id} style={styles.friendCard}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{friend.username.slice(0, 1).toUpperCase()}</Text>
                  </View>
                  <View style={styles.friendCopy}>
                    <Text style={styles.friendName}>{friend.username}</Text>
                    <Text style={styles.friendMeta}>
                      {friend.email || `Connected ${formatRelativeDate(friend.connected_at)}`}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>
                No friends added yet. Start with one person and shared planning will feel much lighter.
              </Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Ideas</Text>
          <View style={styles.friendList}>
            {suggestedPeople.map((person) => (
              <View key={person.id} style={styles.friendCard}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{person.username.slice(0, 1).toUpperCase()}</Text>
                </View>
                <View style={styles.friendCopy}>
                  <Text style={styles.friendName}>{person.username}</Text>
                  <Text style={styles.friendMeta}>{person.detail}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
    gap: 20,
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
  actionPanel: {
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 20,
    gap: 18,
  },
  sectionCopy: {
    gap: 4,
  },
  sectionEyebrow: {
    color: theme.colors.accentHigh,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
  },
  sectionText: {
    color: theme.colors.textSecondary,
    lineHeight: 21,
  },
  actionStack: {
    gap: 10,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: "700",
  },
  friendList: {
    gap: 12,
  },
  friendCard: {
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: theme.colors.appCardMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },
  friendCopy: {
    flex: 1,
    gap: 4,
  },
  friendName: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  friendMeta: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  errorText: {
    color: theme.colors.coral,
    fontWeight: "700",
  },
});
