import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import Button from "@/components/button";
import InputText from "@/components/InputText";
import Logo from "@/components/logo";
import login from "@/services/authLogin";
import { useSession } from "@/services/session";
import { styles } from "@/styles/login";

export default function Login() {
  const router = useRouter();
  const { continueAsGuest, signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const session = await login(email.trim(), password);
      await signIn(session);
      router.replace("/home");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGuestAccess() {
    await continueAsGuest();
    router.replace("/home");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.pressable} onPress={Keyboard.dismiss}>
          <Logo />

          <View style={styles.content}>
            <Text style={styles.title}>Welcome to PROJECT</Text>
            <Text style={styles.subtitle}>Create an account{"\n"}or{"\n"}Login</Text>

            <InputText
              label="E-mail"
              placeholder="example@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <InputText
              label="Password"
              placeholder="***********"
              secure
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.actions}>
              <Button
                title="Register"
                variant="secondary"
                onPress={() => router.push("/register")}
                style={styles.actionButton}
              />
              <Button
                title={isSubmitting ? "Logging in..." : "Login"}
                onPress={handleLogin}
                style={styles.actionButton}
              />
            </View>

            <View style={styles.metaRow}>
              <View style={styles.socialBadge}>
                <Text style={styles.socialBadgeText}>G</Text>
              </View>
              <Text style={styles.guestLink} onPress={() => void handleGuestAccess()}>
                Login as a guest
              </Text>
            </View>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <Text style={styles.link}>Terms of service</Text>
            <Text style={styles.link}>Privacy policy</Text>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
