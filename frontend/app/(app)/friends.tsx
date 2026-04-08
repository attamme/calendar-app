import { useIsFocused } from "@react-navigation/native";
import { startTransition, useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Button from "@/components/button";
import InputText from "@/components/InputText";
import { useAuth } from "@/providers/AuthProvider";
import { addFriend, fetchFriends } from "@/services/api";
import { theme } from "@/theme/tokens";
import type { FriendConnection } from "@/types/planner";
import { formatRelativeDate } from "@/utils/dates";

export default function FriendsScreen() {
  const { token, signOut } = useAuth();
  const isFocused = useIsFocused();

  const [friends, setFriends] = useState<FriendConnection[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

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
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Collaboration</Text>
          <Text style={styles.title}>Build accountability without giving up control of your own plans.</Text>
          <Text style={styles.subtitle}>
            Add friends here first, then share whole calendars or only the specific event or task that matters.
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Add a friend</Text>
          <InputText
            autoCapitalize="none"
            label="Username or email"
            onChangeText={setUsername}
            placeholder="project-partner or alex@example.com"
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

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Your friend list</Text>
          <Text style={styles.panelText}>
            Tap into shared calendars from the calendars tab, or share a single event from the item editor.
          </Text>

          <View style={styles.friendList}>
            {friends.length ? (
              friends.map((friend) => (
                <View key={friend.id} style={styles.friendCard}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{friend.username.slice(0, 1).toUpperCase()}</Text>
                  </View>
                  <View style={styles.friendCopy}>
                    <Text style={styles.friendName}>{friend.username}</Text>
                    <Text style={styles.friendMeta}>{friend.email}</Text>
                    <Text style={styles.friendMeta}>Connected {formatRelativeDate(friend.connected_at)}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No friends added yet. Start with one study partner or accountability buddy.</Text>
            )}
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Session</Text>
          <Text style={styles.panelText}>
            Your session stays signed in, but you can log out here any time.
          </Text>
          <Button onPress={signOut} title="Log out" variant="secondary" />
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
    borderRadius: 30,
    padding: 22,
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  eyebrow: {
    color: theme.colors.coral,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 36,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  panel: {
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 20,
    gap: 16,
  },
  panelTitle: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: "800",
  },
  panelText: {
    color: theme.colors.textSecondary,
    lineHeight: 21,
  },
  friendList: {
    gap: 12,
  },
  friendCard: {
    flexDirection: "row",
    gap: 14,
    padding: 16,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceMuted,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: theme.colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: theme.colors.accent,
    fontWeight: "800",
    fontSize: 18,
  },
  friendCopy: {
    flex: 1,
    gap: 4,
  },
  friendName: {
    color: theme.colors.textPrimary,
    fontSize: 17,
    fontWeight: "800",
  },
  friendMeta: {
    color: theme.colors.textSecondary,
  },
  emptyText: {
    color: theme.colors.textMuted,
    lineHeight: 20,
  },
  errorText: {
    color: theme.colors.coral,
    fontWeight: "700",
  },
});
