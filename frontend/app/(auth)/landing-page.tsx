import React from "react";
import { View, Text, Image, TouchableOpacity, StatusBar } from "react-native";
import { styles } from "../../styles/landing";
import Button from "../../components/button";
import { useRouter } from "expo-router";

// Import assets
const AppIcon = require("../../assets/images/icon.png");
const LandingPhoto = require("../../assets/images/landing-photo.png");

export default function Landing() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Blurred background circles */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
      <View style={styles.backgroundCircle3} />

      {/* siia tuleb logo */}
      <Image source={AppIcon} style={styles.logo} resizeMode="contain" />

      {/* Main Content */}
      <Text style={styles.title}>Need help with daily tasks?</Text>
      <Text style={styles.subtitle}>We can help you with that!</Text>

      {/* Hero Image */}
      <View style={styles.heroContainer}>
        <Image source={LandingPhoto} style={styles.heroImage} />
      </View>

      <Text style={styles.sectionTitle}>Join us</Text>

      <View style={styles.buttonRow}>
        <Button 
          title="Register" 
          onPress={() => router.push("/")} 
          style={styles.registerButton}
        />
        <Button 
          title="Login" 
          onPress={() => router.push("/")} 
          style={styles.loginButton}
        />
      </View>

      <Text style={styles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ornare nibh a
        porta gravida. Nullam ac sodales odio, sit amet maximus leo. Integer vel
        odio nibh. Vivamus dolor justo, sagittis non scelerisque maximus, semper
        sit amet nunc.
      </Text>

      {/* Floating Help Button */}
      <TouchableOpacity style={styles.helpButton} activeOpacity={0.8}>
        <Text style={styles.helpButtonText}>?</Text>
      </TouchableOpacity>
    </View>
  );
}