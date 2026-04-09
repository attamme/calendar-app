import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import MiniCalendar from "@/components/MiniCalendar";
import { styles } from "@/styles/home";

const CALENDAR_CARDS = ["All", "Work"] as const;

export default function Home() {
  const [selectedCalendar, setSelectedCalendar] = useState<(typeof CALENDAR_CARDS)[number]>("All");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View pointerEvents="none" style={styles.backgroundOrbLarge} />
      <View pointerEvents="none" style={styles.backgroundOrbSmall} />
      <View style={styles.container}>
        <View style={styles.sidebar}>
          <Pressable accessibilityRole="button" style={styles.closeButton}>
            <Ionicons color="#FFFFFF" name="close" size={28} />
          </Pressable>

          <View style={styles.sidebarActions}>
            <Pressable accessibilityRole="button" style={styles.sidebarIconButton}>
              <Ionicons color="#FFFFFF" name="people-outline" size={22} />
            </Pressable>
            <Pressable accessibilityRole="button" style={styles.sidebarIconButton}>
              <Ionicons color="#FFFFFF" name="help-circle-outline" size={22} />
            </Pressable>
            <Pressable accessibilityRole="button" style={styles.sidebarIconButton}>
              <Ionicons color="#FFFFFF" name="settings-outline" size={22} />
            </Pressable>
          </View>

          <Pressable accessibilityRole="button" style={styles.addButton}>
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
            <View style={styles.todayCard}>
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
                <View style={styles.todayButton}>
                  <Text style={styles.todayButtonText}>view all</Text>
                </View>
                <View style={styles.todayButton}>
                  <Text style={styles.todayButtonText}>Sort by</Text>
                </View>
                <View style={styles.todayButton}>
                  <Text style={styles.todayButtonText}>Set reminder</Text>
                </View>
              </View>
            </View>

            <View style={styles.calendarLabels}>
              <Text style={styles.calendarLabel}>All</Text>
              <Text style={styles.calendarLabel}>Work</Text>
            </View>
            <View style={styles.calendarRow}>
              {CALENDAR_CARDS.map((label) => (
                <MiniCalendar
                  key={label}
                  label={label}
                  onPress={() => setSelectedCalendar(label)}
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
