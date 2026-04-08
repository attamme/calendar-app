import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View } from "react-native";
import MonthlyCalendar, { type CalendarEvent } from "@/components/MonthlyCalendar";
import { colors } from "@/styles/colors";

const demoEvents: CalendarEvent[] = [
  {
    id: "commit-crimes",
    label: "Commit crimes",
    weekIndex: 0,
    startDay: 1,
    endDay: 7,
    color: "#5E59FF",
  },
  {
    id: "green-span",
    weekIndex: 1,
    startDay: 1,
    endDay: 5,
    color: "#37F000",
  },
  {
    id: "red-span",
    weekIndex: 1,
    startDay: 4,
    endDay: 4,
    color: "#FF3737",
  },
];

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, padding: 10 }}
      >
        <View style={{ flex: 1 }}>
          <MonthlyCalendar events={demoEvents} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
