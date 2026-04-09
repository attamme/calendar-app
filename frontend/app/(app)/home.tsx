import { SafeAreaView, Text, View } from "react-native";
import Button from "@/components/button";
import { useSession } from "@/services/session";

export default function Home() {
  const { signOut, status } = useSession();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 24,
        paddingTop: 32,
      }}
    >
      <View style={{ gap: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: "600", color: "#171717" }}>Calendar App</Text>
        <Text style={{ fontSize: 16, lineHeight: 24, color: "#6A6A6A" }}>
          Protected app shell is active. Current session: {status}.
        </Text>
        <Button title="Sign out" variant="secondary" onPress={signOut} style={{ width: 152 }} />
      </View>
    </SafeAreaView>
  );
}
