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
import InputText from "@/components/InputText";
import { useAuth } from "@/providers/AuthProvider";
import { usePlannerSync } from "@/providers/PlannerSyncProvider";
import { addFriend, fetchFriends } from "@/services/api";
import { theme } from "@/theme/tokens";
import type { FriendConnection } from "@/types/planner";
import { formatRelativeDate } from "@/utils/dates";

export default function FriendsScreen() {
  const router = useRouter();
  const { token, signOut } = useAuth();
  const { notifyPlannerChanged } = usePlannerSync();
  const isFocused = useIsFocused();

  const [friends, setFriends] = useState<FriendConnection[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  const suggestedPeople = useMemo(
    () => [
      { id: "suggest-1", username: "Study Buddy", detail: "Search by username to invite someone new." },
      { id: "suggest-2", username: "Project Partner", detail: "Shared events work well for one-off plans." },
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
      await loadFriends();
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
          title="Friends list"
        />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Find users</Text>
          <InputText
            autoCapitalize="none"
            hideLabel
            onChangeText={setUsername}
            placeholder="Search"
            value={username}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Button
            disabled={!username.trim()}
            loading={saving}
            onPress={handleAddFriend}
            title="Add friend"
          />
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
                  <View style={styles.actionBubble}>
                    <Text style={styles.actionBubbleText}>+</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>
                No friends added yet. Start with one person and shared plans will feel much lighter.
              </Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>People you may know</Text>
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
                <View style={styles.actionBubble} />
              </View>
            ))}
          </View>
        </View>

        <Button onPress={signOut} title="Log out" variant="secondary" />
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
  section: {
    gap: 12,
  },
  sectionLabel: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: "500",
  },
  friendList: {
    gap: 12,
  },
  friendCard: {
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
  },
  avatar: {
    width: 38,
    height: 38,
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
    fontWeight: "500",
  },
  friendMeta: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  actionBubble: {
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: theme.colors.appCardMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBubbleText: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    lineHeight: 24,
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
