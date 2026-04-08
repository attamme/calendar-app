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
          <View style={{ marginTop: 16, gap: 12 }}>
            <MiniCalendar label="Work" />
            <MiniCalendar label="School" strokeColor="#3D49FF" />
          </View>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};