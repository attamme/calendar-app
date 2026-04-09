import { Image, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import Button from "@/components/button";
import Logo from "@/components/logo";
import { styles } from "@/styles/landing";

const LandingPhoto = require("../../assets/images/landing-photo.png");

export default function Landing() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Logo />

      <View style={styles.content}>
        <View>
          <Text style={styles.title}>Need help with daily tasks?</Text>
          <Text style={styles.subtitle}>We can help you with that!</Text>
        </View>

        <Image source={LandingPhoto} style={styles.heroImage} />

        <View>
          <Text style={styles.sectionTitle}>Join us here!</Text>
          <View style={styles.buttonRow}>
            <Button
              title="Register"
              variant="secondary"
              onPress={() => router.push("/register")}
              style={styles.actionButton}
            />
            <Button
              title="Login"
              onPress={() => router.push("/login")}
              style={styles.actionButton}
            />
          </View>
        </View>

        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ornare nibh a porta
          gravida. Nullam ac sodales odio, sit amet maximus leo. Integer vel odio nibh.
          Vivamus dolor justo, sagittis non scelerisque maximus, semper sit amet nunc.
        </Text>
      </View>

      <TouchableOpacity activeOpacity={0.8} style={styles.helpButton}>
        <Text style={styles.helpButtonText}>?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
