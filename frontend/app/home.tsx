import { useRouter } from "expo-router";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Button from "@/components/button";
import { styles } from "../styles/home";

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Calendar App!</Text>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
