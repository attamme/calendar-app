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
            <Text style={styles.title}>New account</Text>

            <InputText
              label="Username"
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              labelHidden
            />
            <InputText
              label="E-mail"
              placeholder="example@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              labelHidden
            />
            <InputText
              label="Password"
              placeholder="***********"
              secure
              value={password}
              onChangeText={setPassword}
              labelHidden
            />
            <InputText
              label="Repeat password"
              placeholder="***********"
              secure
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              labelHidden
            />

            <Button
              title={isSubmitting ? "Registering..." : "Register"}
              onPress={handleRegister}
              style={styles.submitButton}
            />

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <View style={styles.bottomLinks}>
              <Text style={styles.link} onPress={() => void handleGuestAccess()}>
                Login as a guest
              </Text>
              <Text style={styles.link} onPress={() => router.push("/login")}>
                Already have an account?
              </Text>
            </View>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
