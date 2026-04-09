import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ActivityIndicator, View } from "react-native";
import { SessionProvider, useSession } from "@/services/session";
import { typography } from "@/styles/tokens";

void SplashScreen.preventAutoHideAsync();

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
  const [fontsLoaded, fontLoadError] = useFonts({
    [typography.fontFamily.inter]: require("../assets/fonts/Inter-Variable.ttf"),
    [typography.fontFamily.balsamiq]: require("../assets/fonts/BalsamiqSans-Regular.ttf"),
    [typography.fontFamily.balsamiqBold]: require("../assets/fonts/BalsamiqSans-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontLoadError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontLoadError, fontsLoaded]);

  if (!fontsLoaded && !fontLoadError) {
    return null;
  }

  return (
    <SessionProvider>
      <RootNavigator />
    </SessionProvider>
  );
}
