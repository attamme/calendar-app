import { Text, View, Keyboard, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Button from "@/components/button";
import InputText from "@/components/InputText";
import TaskView from "@/components/TaskView";

export default function Index() {
  const router = useRouter()
  return (
    <TaskView />
    );

  };