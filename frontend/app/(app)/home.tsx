import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MiniCalendar from "@/components/MiniCalendar";
import { dashboardCalendars } from "@/services/seedData";
import { useSession } from "@/services/session";
import { styles } from "@/styles/home";

export default function Home() {
  const router = useRouter();
  const { signOut } = useSession();
  const [selectedCalendar, setSelectedCalendar] = useState<(typeof dashboardCalendars)[number]>("All");
  const calendarHref = "/calendar" as Href;
  const reminderHref = "/new-reminder" as Href;

  async function handleClose() {
    await signOut();
    router.replace("/landing-page");
  }

  function openCalendar(label: (typeof dashboardCalendars)[number]) {
    setSelectedCalendar(label);
    router.push(calendarHref);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View pointerEvents="none" style={styles.backgroundOrbLarge} />
      <View pointerEvents="none" style={styles.backgroundOrbSmall} />
      <View style={styles.container}>
        <View style={styles.sidebar}>
          <Pressable accessibilityRole="button" onPress={() => void handleClose()} style={styles.closeButton} testID="home-close-button">
            <Ionicons color="#FFFFFF" name="close" size={28} />
          </Pressable>

          <View style={styles.sidebarActions}>
            <Pressable accessibilityRole="button" onPress={() => router.push(calendarHref)} style={styles.sidebarIconButton}>
              <Ionicons color="#FFFFFF" name="people-outline" size={22} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/day?day=6" as Href)}
              style={styles.sidebarIconButton}
            >
              <Ionicons color="#FFFFFF" name="help-circle-outline" size={22} />
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => router.push(reminderHref)} style={styles.sidebarIconButton}>
              <Ionicons color="#FFFFFF" name="settings-outline" size={22} />
            </Pressable>
          </View>

          <Pressable accessibilityRole="button" onPress={() => router.push(reminderHref)} style={styles.addButton} testID="home-add-button">
            <Ionicons color="#FFFFFF" name="add" size={28} />
          </Pressable>
        </View>

        <View style={styles.main}>
          <View style={styles.header}>
            <View style={styles.headerMenu}>
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
            </View>
            <Text style={styles.headerTitle}>My calendar</Text>
          </View>

          <View style={styles.content}>
            <Pressable onPress={() => router.push("/day?day=6" as Href)} style={styles.todayCard}>
              <View style={styles.todayHeaderRow}>
                <View style={styles.todayBadge} />
                <Text style={styles.todayLabel}>Today</Text>
                <View style={styles.taskBars}>
                  <View style={[styles.taskBar, styles.taskBarWarm]} />
                  <View style={[styles.taskBar, styles.taskBarAmber]} />
                  <View style={[styles.taskBar, styles.taskBarOrange]} />
                  <View style={[styles.taskBar, styles.taskBarLime]} />
                  <View style={[styles.taskBar, styles.taskBarLime]} />
                </View>
              </View>
              <Text style={styles.taskTitle}>
                The task description is written here, just write anything here. You can tap this to
                extend it. I repeat the task description is written here, just write anything here.
                You can tap this to extend it.
              </Text>
              <Ionicons color="#8D92B3" name="chevron-back" size={20} style={styles.cardChevronLeft} />
              <Ionicons color="#8D92B3" name="chevron-forward" size={20} style={styles.cardChevronRight} />
              <View style={styles.progressBar} />
              <View style={styles.todayButtons}>
                <Pressable onPress={() => router.push(calendarHref)} style={styles.todayButton}>
                  <Text style={styles.todayButtonText}>view all</Text>
                </Pressable>
                <Pressable onPress={() => router.push(calendarHref)} style={styles.todayButton}>
                  <Text style={styles.todayButtonText}>Sort by</Text>
                </Pressable>
                <Pressable onPress={() => router.push(reminderHref)} style={styles.todayButton}>
                  <Text style={styles.todayButtonText}>Set reminder</Text>
                </Pressable>
              </View>
            </Pressable>

            <View style={styles.calendarLabels}>
              <Text style={styles.calendarLabel}>All</Text>
              <Text style={styles.calendarLabel}>Work</Text>
            </View>
            <View style={styles.calendarRow}>
              {dashboardCalendars.map((label) => (
                <MiniCalendar
                  key={label}
                  label={label}
                  onPress={() => openCalendar(label)}
                  selected={selectedCalendar === label}
                  testID={`dashboard-calendar-${label.toLowerCase()}`}
                  variant="dashboard"
                />
              ))}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
