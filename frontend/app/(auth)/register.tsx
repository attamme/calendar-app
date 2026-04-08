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
      showBackButton
      title="Create your planner space"
      subtitle="Start with your own calendars, then add classes, routines, reminders, and friends when you are ready."
      tone="figma"
      footer={
        <View style={styles.footer}>
          <Button
            loading={loading}
            onPress={handleRegister}
            style={styles.primaryButton}
            title="Create account"
          />
          <Pressable onPress={() => router.replace("/(auth)/login")}>
            <Text style={styles.link}>Already have an account? Log in.</Text>
          </Pressable>
        </View>
      }
    >
      <View style={styles.formCard}>
        <InputText
          autoCapitalize="none"
          hideLabel
          onChangeText={setUsername}
          placeholder="Username"
          variant="figma"
          value={username}
        />
        <InputText
          autoCapitalize="none"
          hideLabel
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Email"
          variant="figma"
          value={email}
        />
        <InputText
          autoCapitalize="none"
          hideLabel
          onChangeText={setPassword}
          placeholder="Password"
          secure
          variant="figma"
          value={password}
        />
        <InputText
          autoCapitalize="none"
          hideLabel
          onChangeText={setConfirmPassword}
          placeholder="Repeat password"
          secure
          variant="figma"
          value={confirmPassword}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  formCard: {
    gap: 18,
  },
  primaryButton: {
    backgroundColor: theme.colors.figmaAccent,
    borderColor: theme.colors.figmaAccent,
  },
  footer: {
    gap: 12,
  },
  link: {
    color: theme.colors.figmaSubtext,
    textAlign: "center",
    fontWeight: "700",
  },
  errorText: {
    color: "#FFB4B4",
    fontWeight: "700",
  },
});
