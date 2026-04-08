import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import Button from "@/components/button";
import InputText from "@/components/InputText";
import ScreenShell from "@/components/ScreenShell";
import { useAuth } from "@/providers/AuthProvider";
import { theme } from "@/theme/tokens";

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setError("");
      setLoading(true);
      await signIn(email, password);
      router.replace("/(app)/dashboard");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenShell
      title="Welcome back"
      subtitle="Jump straight into today, easy wins, and the reminders that keep your plans visible."
      footer={
        <View style={styles.footer}>
          <Button loading={loading} onPress={handleLogin} title="Log in" />
          <Pressable onPress={() => router.replace("/(auth)/register")}>
            <Text style={styles.link}>Need an account? Register instead.</Text>
          </Pressable>
        </View>
      }
    >
      <View style={styles.formCard}>
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
