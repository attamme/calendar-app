import { Text, View } from "react-native";
import InputText from "@/components/InputText";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <InputText placeholder="Text"/>
    </View>
  );
}
