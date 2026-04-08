import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import Button from "@/components/button";
import InputText from "@/components/InputText";
import ScreenShell from "@/components/ScreenShell";
import { useAuth } from "@/providers/AuthProvider";
import { theme } from "@/theme/tokens";

export default function Register() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await signUp(username, email, password);
      router.replace("/(app)/dashboard");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenShell
      title="Create your planner space"
      subtitle="Start with your own calendars, then add classes, routines, reminders, and friends when you are ready."
      footer={
        <View style={styles.footer}>
          <Button loading={loading} onPress={handleRegister} title="Create account" />
          <Pressable onPress={() => router.replace("/(auth)/login")}>
            <Text style={styles.link}>Already have an account? Log in.</Text>
          </Pressable>
        </View>
      }
    >
      <View style={styles.formCard}>
        <InputText
          autoCapitalize="none"
          label="Username"
          onChangeText={setUsername}
          placeholder="focus-friend"
          value={username}
        />
        <InputText
          autoCapitalize="none"
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmail}
          placeholder="you@example.com"
          value={email}
        />
        <InputText
          autoCapitalize="none"
          label="Password"
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          secure
          value={password}
        />
        <InputText
          autoCapitalize="none"
          label="Repeat password"
          onChangeText={setConfirmPassword}
          placeholder="Repeat your password"
          secure
          value={confirmPassword}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 26,
    padding: 20,
    gap: 18,
  },
  footer: {
    gap: 12,
  },
  link: {
    color: theme.colors.accent,
    textAlign: "center",
    fontWeight: "700",
  },
  errorText: {
    color: theme.colors.coral,
    fontWeight: "700",
  },
});
