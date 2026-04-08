import { Text, View, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "@/components/button";
import InputText from "@/components/InputText";
import MiniCalendar from "@/components/MiniCalendar";
import TaskView from "@/components/TaskView";

export default function Index() {
  const router = useRouter()
  return (

    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
        >
          <Text>Edit app/index.tsx to edit this screen.</Text>
          <InputText label="Text" placeholder="Text"/>
          <InputText label="Password" placeholder="**********" secure />
          <Button title="Login" onPress={ () => router.navigate("/(auth)/login")}/>
          <Button title="Register" onPress={ () => router.navigate("/(auth)/register")} />
          <View style={{ marginTop: 20 }}>
            <TaskView
              title="Today"
              description="The task description is written here. Just write anything here. You can tap this to extend it. I repeat: the task description is written here."
              priority={5}
            />
          </View>
          <View style={{ marginTop: 16, gap: 12 }}>
            <MiniCalendar
              label="Work"
              cellIcons={[
                <MaterialCommunityIcons key="work-0" name="briefcase-outline" size={16} color="#C8D4FF" />,
                <MaterialCommunityIcons key="work-1" name="account-group-outline" size={16} color="#C8D4FF" />,
                <MaterialCommunityIcons key="work-2" name="calendar-check-outline" size={16} color="#C8D4FF" />,
                <MaterialCommunityIcons key="work-3" name="chart-box-outline" size={16} color="#C8D4FF" />,
              ]}
            />
            <MiniCalendar
              label="School"
              strokeColor="#3D49FF"
              cellIcons={[
                <MaterialCommunityIcons key="school-0" name="book-open-page-variant-outline" size={16} color="#C8D4FF" />,
                <MaterialCommunityIcons key="school-1" name="notebook-outline" size={16} color="#C8D4FF" />,
                <MaterialCommunityIcons key="school-2" name="school-outline" size={16} color="#C8D4FF" />,
                <MaterialCommunityIcons key="school-3" name="clock-outline" size={16} color="#C8D4FF" />,
              ]}
            />
          </View>
        </ScrollView>
      </Pressable>
    </KeyboardAvoidingView>
  );
};