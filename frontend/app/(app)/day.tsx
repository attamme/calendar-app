import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { remindersByDay } from "@/services/seedData";
import { styles } from "@/styles/day_screen";

export default function DayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ day?: string }>();
  const selectedDay = Number(params.day || "6");
  const reminders = remindersByDay[selectedDay] ?? [];
  const tasks = reminders.filter((item) => item.type === "task");
  const events = reminders.filter((item) => item.type === "event");
  const reminderHref = "/new-reminder" as Href;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <View style={styles.closeButton} />
          <Text style={styles.dateLabel}>{`${selectedDay} Jan`}</Text>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons color="#FFFFFF" name="close" size={20} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TASKS</Text>
          <View style={styles.itemList}>
            {tasks.map((task) => (
              <View key={task.id} style={styles.itemCard}>
                <Text style={styles.itemText}>{task.title}</Text>
                <Text style={styles.itemMeta}>{task.description}</Text>
              </View>
            ))}
            <Pressable onPress={() => router.push(reminderHref)} style={styles.itemCard}>
              <View style={styles.addRow}>
                <Text style={styles.addText}>Add new task</Text>
                <Ionicons color="#FFFFFF" name="add" size={18} />
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Events</Text>
          <View style={styles.itemList}>
            {events.map((event) => (
              <View key={event.id} style={styles.itemCard}>
                <Text style={styles.itemText}>{event.title}</Text>
                <Text style={styles.itemMeta}>{event.description}</Text>
              </View>
            ))}
            <Pressable onPress={() => router.push(reminderHref)} style={styles.itemCard}>
              <View style={styles.addRow}>
                <Text style={styles.addText}>Add new event</Text>
                <Ionicons color="#FFFFFF" name="add" size={18} />
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
