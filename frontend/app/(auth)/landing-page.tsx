import React from "react";
import { View, Text, Image } from "react-native";
import { styles } from "@/styles/landing";
import Button from "@/components/button";
import { useRouter } from "expo-router";

// const ImageAsset = require("@/assets/images/landing_photo.png"); //the @ didnt want to work

export default function Landing() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Need help with daily tasks?</Text>
      <Text style={styles.subtitle}>We can help you with that!</Text>


      <Text style={styles.sectionTitle}>Join us</Text>

      <View style={styles.buttonRow}>
        <Button title="Register" onPress={() => router.push("/")} />
        <Button title="Login" onPress={() => router.push("/")} />
      </View>

      <Text style={styles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ornare nibh a
        porta gravida. Nullam ac sodales odio, sit amet maximus leo. Integer vel
        odio nibh. Vivamus dolor justo, sagittis non scelerisque maximus, semper
        sit amet nunc.
      </Text>
    </View>
  );
}