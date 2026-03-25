import { Text, View, Keyboard, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Button from "@/components/button";
import InputText from "@/components/InputText";
import MiniCalendar from "@/components/MiniCalendar";

export default function Index() {
  const router = useRouter()
  return (

    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View>
          <Text>Edit app/index.tsx to edit this screen.</Text>
          <InputText label="Text" placeholder="Text"/>
          <InputText label="Password" placeholder="**********" secure />
          <Button title="Login" onPress={ () => router.navigate("/(auth)/login")}/>
          <Button title="Register" onPress={ () => router.navigate("/(auth)/register")} />
          <MiniCalendar label="Name" />
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};