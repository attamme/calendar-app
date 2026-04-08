import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View } from "react-native";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import { colors } from "@/styles/colors";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, padding: 10 }}
      >
        <View style={{ flex: 1 }}>
          <MonthlyCalendar />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
