import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { SessionProvider, useSession } from "@/services/session";

function RootNavigator() {
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

  const hasAppAccess = status === "authenticated" || status === "guest";
  const isSignedOut = status === "anonymous";

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={isSignedOut}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={hasAppAccess}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootNavigator />
    </SessionProvider>
  );
}
