import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { useSession } from "@/services/session";
import { colors } from "@/styles/tokens";

export default function Index() {
  const { isHydrated, status } = useSession();

  if (!isHydrated) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="small" color={colors.textSecondary} />
      </View>
    );
  }

  if (status === "authenticated" || status === "guest") {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/landing-page" />;
}
