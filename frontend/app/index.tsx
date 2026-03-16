import { Text, View } from "react-native";
import InputText from "@/components/InputText";
import { styles } from "@/styles/test";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <InputText label="Text" placeholder="Text"/>
      <InputText label="Password" placeholder="**********" secure />
    </View>
  );
}
