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
      showBackButton
      title="Welcome back"
      subtitle="Jump straight into today, easy wins, and the reminders that keep your plans visible."
      tone="figma"
      footer={
        <View style={styles.footer}>
          <Button loading={loading} onPress={handleLogin} style={styles.primaryButton} title="Log in" />
          <Pressable onPress={() => router.replace("/(auth)/register")}>
            <Text style={styles.link}>Need an account? Register instead.</Text>
          </Pressable>
        </View>
      }
    >
      <View style={styles.formCard}>
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
