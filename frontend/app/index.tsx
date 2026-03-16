import { Text, View, Keyboard, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import InputText from "@/components/InputText";
import { styles } from "@/styles/test";

export default function Index() {
  return (

    <KeyboardAvoidingView style={{ flex: 1 }} behaviour={Platform.OS === "ios" ? "padding" : "height"}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text>Edit app/index.tsx to edit this screen.</Text>
          <InputText label="Text" placeholder="Text"/>
          <InputText label="Password" placeholder="**********" secure />
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
