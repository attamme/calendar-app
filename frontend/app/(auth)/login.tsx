import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

  function handleBack() {
    router.replace("/landing-page");
  }

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
      router.replace("/");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGuestAccess() {
    try {
      await continueAsGuest();
      router.replace("/");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Guest mode failed.");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View pointerEvents="none" style={styles.backgroundOrbLarge} />
      <View pointerEvents="none" style={styles.backgroundOrbSmall} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.screen}>
            <View style={styles.topBar}>
              <Pressable onPress={handleBack} style={styles.backButton} testID="login-back-button">
                <Text style={styles.backButtonText}>‹</Text>
              </Pressable>
              <Logo
                onPress={() => router.replace("/landing-page")}
                style={styles.logoTouchTarget}
                testID="login-logo-button"
              />
              <View style={styles.topBarSpacer} />
            </View>

            <View style={styles.content}>
              <Text style={styles.title}>Good day, sire.</Text>
              <Text style={styles.subtitle}>Log in to your account</Text>

              <InputText
                label="E-mail"
                placeholder="Username"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                labelHidden
                testID="login-email-input"
              />
              <InputText
                label="Password"
                placeholder="Password"
                secure
                value={password}
                onChangeText={setPassword}
                labelHidden
                testID="login-password-input"
              />

              <View style={styles.actions}>
                <Button
                  title="Register"
                  variant="secondary"
                  onPress={() => router.push("/register")}
                  style={styles.actionButton}
                  testID="login-register-button"
                />
                <Button
                  title={isSubmitting ? "Logging in..." : "Login"}
                  onPress={handleLogin}
                  style={styles.actionButton}
                  testID="login-submit-button"
                />
              </View>

              <View style={styles.metaRow}>
                <View style={styles.socialBadge}>
                  <Text style={styles.socialBadgeText}>G</Text>
                </View>
                <Pressable onPress={() => void handleGuestAccess()} testID="login-guest-link">
                  <Text style={styles.guestLink}>Login as guest</Text>
                </Pressable>
              </View>

              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

              <Text style={styles.link}>Terms of service</Text>
              <Text style={styles.link}>Privacy policy</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
