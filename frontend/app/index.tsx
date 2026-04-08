import { useMemo, useState } from "react";
import { Text, View, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "@/components/button";
import InputText from "@/components/InputText";
import MiniCalendar from "@/components/MiniCalendar";
import TaskView from "@/components/TaskView";

const SAMPLE_TASKS = [
  {
    id: "task-1",
    title: "Today",
    priority: 5,
    description:
      "Finish the dashboard polish pass and review the pending edits with the team. Tap this text to expand and collapse it.",
  },
  {
    id: "task-2",
    title: "Work",
    priority: 3,
    description:
      "Prepare meeting notes, send out timelines, and align on next sprint items. Keep this short by default and expand if needed.",
  },
  {
    id: "task-3",
    title: "Personal",
    priority: 2,
    description:
      "Pick up groceries, plan dinner, and check calendar sync settings before tomorrow morning.",
  },
] as const;

export default function Index() {
  const router = useRouter();
  const [taskIndex, setTaskIndex] = useState(0);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);

  const activeTask = SAMPLE_TASKS[taskIndex];
  const isActiveTaskCompleted = completedTaskIds.includes(activeTask.id);

  const canGoPrevious = taskIndex > 0;
  const canGoNext = taskIndex < SAMPLE_TASKS.length - 1;

  const completedCount = useMemo(() => completedTaskIds.length, [completedTaskIds]);

  const handlePreviousTask = () => {
    if (!canGoPrevious) {
      return;
    }

    setTaskIndex((current) => current - 1);
  };

  const handleNextTask = () => {
    if (!canGoNext) {
      return;
    }

    setTaskIndex((current) => current + 1);
  };

  const handleToggleTaskCompleted = () => {
    setCompletedTaskIds((current) => {
      if (current.includes(activeTask.id)) {
        return current.filter((taskId) => taskId !== activeTask.id);
      }

      return [...current, activeTask.id];
    });
  };

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
          <Text style={{ marginTop: 16, color: "#D5D0FF" }}>
            Task playground: {completedCount}/{SAMPLE_TASKS.length} completed
          </Text>
          <View style={{ marginTop: 20 }}>
            <TaskView
              taskKey={activeTask.id}
              title={activeTask.title}
              description={activeTask.description}
              priority={activeTask.priority}
              priorityMax={5}
              currentTaskIndex={taskIndex}
              totalTasks={SAMPLE_TASKS.length}
              isCompleted={isActiveTaskCompleted}
              onPrevious={canGoPrevious ? handlePreviousTask : undefined}
              onNext={canGoNext ? handleNextTask : undefined}
              onMarkFinished={handleToggleTaskCompleted}
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