import { Text, View } from "react-native";
import Button from "@/components/button";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="Button"/>
    </View>
  );
};