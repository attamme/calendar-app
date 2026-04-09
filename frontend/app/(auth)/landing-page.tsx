import React from "react";
import { View, Text, Image, TouchableOpacity, StatusBar, StyleSheet, Dimensions } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Circle, Rect } from 'react-native-svg';
import { styles } from "../../styles/landing";
import Button from "../../components/button";
import { useRouter } from "expo-router";
import { colors } from "../../constants/color";

// Import assets
const AppIcon = require("../../assets/images/logo.png");
const LandingPhoto = require("../../assets/images/landing-photo.png");

const { width, height } = Dimensions.get("window");

export default function Landing() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* SVG Background with soft gradients */}
      <View style={[StyleSheet.absoluteFill, { zIndex: -1 }]}>
        <Svg height="100%" width="100%">
          <Defs>
            <RadialGradient id="grad1" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={colors.btn_yes} stopOpacity="0.4" />
              <Stop offset="100%" stopColor={colors.btn_yes} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="grad2" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={colors.orange} stopOpacity="0.2" />
              <Stop offset="100%" stopColor={colors.orange} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="grad3" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={colors.btn_third} stopOpacity="0.3" />
              <Stop offset="100%" stopColor={colors.btn_third} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="#404258" />
          
          {/* Top Left - Purple */}
          <Circle cx="0" cy="0" r={width * 0.9} fill="url(#grad1)" />
          
          {/* Bottom Right - Orange */}
          <Circle cx={width} cy={height * 0.8} r={width * 0.9} fill="url(#grad2)" />
          
          {/* Bottom Left - Blueish */}
          <Circle cx="0" cy={height} r={width * 0.8} fill="url(#grad3)" />
        </Svg>
      </View>

      <Image source={AppIcon} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Need help with daily tasks?</Text>
      <Text style={styles.subtitle}>We can help you with that!</Text>

      <View style={styles.heroContainer}>
        <Image source={LandingPhoto} style={styles.heroImage} />
      </View>

      <Text style={styles.sectionTitle}>Join us</Text>

      <View style={styles.buttonRow}>
        <Button 
          title="Register" 
          onPress={() => router.push("/")} //siia registeri leht
          style={styles.registerButton}
        />
        <Button 
          title="Login" 
          onPress={() => router.push("/")} //siia logini leht
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