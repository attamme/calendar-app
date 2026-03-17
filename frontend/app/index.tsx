import { Text, View, Keyboard, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import Button from "@/components/button";
import InputText from "@/components/InputText";

export default function Index() {
  function pressed() {
    console.log("Button pressed")
  }

  return (

    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View>
          <Text>Edit app/index.tsx to edit this screen.</Text>
          <InputText label="Text" placeholder="Text" onChangeText={(text) => console.log(text)}/>
          <InputText label="Password" placeholder="**********" secure onChangeText={(text) => console.log(text)}/>
          <Button title="Button" onPress={pressed}/>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};