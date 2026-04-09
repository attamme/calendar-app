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
import registerUser from "@/services/authRegister";
import { useSession } from "@/services/session";
import { styles } from "@/styles/register";

export default function Register() {
  const router = useRouter();
  const { continueAsGuest } = useSession();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleBack() {
    router.replace("/landing-page");
  }

  async function handleRegister() {
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage("Fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await registerUser({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      router.replace("/login");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Registration failed.");
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
              <Pressable onPress={handleBack} style={styles.backButton} testID="register-back-button">
                <Text style={styles.backButtonText}>‹</Text>
              </Pressable>
              <Logo
                onPress={() => router.replace("/landing-page")}
                style={styles.logoTouchTarget}
                testID="register-logo-button"
              />
              <View style={styles.topBarSpacer} />
            </View>

            <View style={styles.content}>
              <Text style={styles.title}>New account</Text>

              <InputText
                label="Username"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                labelHidden
                testID="register-username-input"
              />
              <InputText
                label="E-mail"
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                labelHidden
                testID="register-email-input"
              />
              <InputText
                label="Password"
                placeholder="Password"
                secure
                value={password}
                onChangeText={setPassword}
                labelHidden
                testID="register-password-input"
              />
              <InputText
                label="Repeat password"
                placeholder="Repeat password"
                secure
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                labelHidden
                testID="register-confirm-password-input"
              />

              <Button
                title={isSubmitting ? "Registering..." : "Register"}
                onPress={handleRegister}
                style={styles.submitButton}
                testID="register-submit-button"
              />

              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

              <View style={styles.bottomLinks}>
                <Pressable onPress={() => void handleGuestAccess()} testID="register-guest-link">
                  <Text style={styles.link}>Login as guest</Text>
                </Pressable>
                <Pressable onPress={() => router.push("/login")} testID="register-login-link">
                  <Text style={styles.link}>Already have an account?</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
