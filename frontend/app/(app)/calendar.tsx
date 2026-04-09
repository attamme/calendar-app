import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import { calendarEvents, taskStrip } from "@/services/seedData";
import { styles } from "@/styles/calendar_screen";

export default function CalendarScreen() {
  const router = useRouter();
  const homeHref = "/home" as Href;
  const reminderHref = "/new-reminder" as Href;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons color="#FFFFFF" name="chevron-back" size={24} />
          </Pressable>
          <Text style={styles.title}>Work Calendar</Text>
          <View style={styles.topActions}>
            <Text style={styles.topActionText}>Calendar</Text>
            <Text style={styles.topActionText}>Tasks</Text>
          </View>
        </View>

        <View style={styles.tasksSection}>
          <Text style={styles.tasksHeading}>TASKS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.taskStrip}>
              {taskStrip.map((task, index) => (
                <Pressable
                  key={task}
                  onPress={() => router.push(`/day?day=${index === 0 ? 6 : 14}` as Href)}
                  style={[styles.taskCard, index < 2 ? styles.taskCardWide : styles.taskCardNarrow]}
                >
                  <Text numberOfLines={2} style={styles.taskCardText}>
                    {task}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.calendarSection}>
          <MonthlyCalendar
            events={calendarEvents}
            initialDate={new Date(2024, 0, 6)}
            onDayPress={(day) => router.push(`/day?day=${day}` as Href)}
          />
        </View>

        <View style={styles.bottomNav}>
          <Pressable onPress={() => router.replace(homeHref)} style={styles.bottomSegment}>
            <Ionicons color="#C8CAE0" name="person-outline" size={22} />
            <Text style={styles.bottomLabel}>Personal</Text>
          </Pressable>
          <View style={styles.bottomSegment}>
            <Ionicons color="#766DDB" name="briefcase-outline" size={22} />
            <Text style={[styles.bottomLabel, styles.bottomLabelActive]}>Work</Text>
          </View>
          <Pressable onPress={() => router.push(reminderHref)} style={styles.bottomSegment}>
            <Ionicons color="#C8CAE0" name="medical-outline" size={22} />
            <Text style={styles.bottomLabel}>Doctor</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
