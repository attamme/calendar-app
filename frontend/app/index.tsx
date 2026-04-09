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
