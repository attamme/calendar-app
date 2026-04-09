import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/styles/reminder_screen";

export default function NewReminderScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons color="#FFFFFF" name="close" size={24} />
          </Pressable>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons color="#FFFFFF" name="checkmark" size={24} />
          </Pressable>
        </View>

        <Text style={styles.title}>New reminder</Text>

        <View style={[styles.card, styles.multilineCard]}>
          <Text style={styles.fieldLabel}>Title</Text>
          <View style={styles.fieldDivider} />
          <Text style={styles.fieldLabel}>Notes</Text>
        </View>

        <Text style={styles.sectionLabel}>Date & Time</Text>
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Date</Text>
          <View style={styles.fieldDivider} />
          <Text style={styles.fieldLabel}>Time</Text>
        </View>

        <Text style={styles.sectionLabel}>Places & People</Text>
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Location</Text>
          <View style={styles.fieldDivider} />
          <Text style={styles.fieldLabel}>People</Text>
        </View>

        <View style={styles.pillRow}>
          <Text style={styles.pillText}>Priority</Text>
          <View style={styles.priorityBadge}>
            <Ionicons color="#FFFFFF" name="alert" size={16} />
          </View>
        </View>
        <View style={styles.pillRow}>
          <Text style={styles.pillText}>Tags</Text>
        </View>
        <View style={styles.pillRow}>
          <Text style={styles.pillText}>Repeat</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
