import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { useSession } from "@/services/session";

export default function Index() {
  const { isHydrated, status } = useSession();

  if (!isHydrated) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        <ActivityIndicator size="small" color="#6A6A6A" />
      </View>
    );
  }

  if (status === "authenticated" || status === "guest") {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/landing-page" />;
}
