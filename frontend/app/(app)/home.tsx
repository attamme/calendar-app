import { useState } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import MiniCalendar from "@/components/MiniCalendar";
import { styles } from "@/styles/home";

const CATEGORY_ROWS = [
  ["School", "Work"],
  ["Daily", "Epstein"],
] as const;

const CALENDAR_CARDS = ["All", "Work"] as const;

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("School");
  const [selectedCalendar, setSelectedCalendar] = useState<(typeof CALENDAR_CARDS)[number]>("All");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.sidebar}>
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>

          <View style={styles.avatarColumn}>
            <View style={styles.avatarCircle} />
            <View style={styles.avatarCircle} />
            <View style={styles.avatarCircle} />
          </View>

          <View style={styles.sidebarActions}>
            <View style={styles.selectionButton}>
              <View style={styles.selectionInner} />
            </View>
            <View style={styles.addButton}>
              <View style={styles.addLineVertical} />
              <View style={styles.addLineHorizontal} />
            </View>
          </View>
        </View>

        <View style={styles.main}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>The most urgent stuff</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.categoryPanel}>
              {CATEGORY_ROWS.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.categoryRow}>
                  {row.map((category) => {
                    const isSelected = category === selectedCategory;

                    return (
                      <Pressable
                        key={category}
                        accessibilityRole="button"
                        accessibilityLabel={`Select ${category} category`}
                        onPress={() => setSelectedCategory(category)}
                        style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                      >
                        <Text style={styles.categoryText}>{category}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
              <Text style={styles.hashText}>#</Text>
            </View>

            <View style={styles.todayCard}>
              <Text style={styles.todayLabel}>Today</Text>
            </View>

            <View style={styles.calendarRow}>
              {CALENDAR_CARDS.map((label) => (
                <MiniCalendar
                  key={label}
                  label={label}
                  onPress={() => setSelectedCalendar(label)}
                  selected={selectedCalendar === label}
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
