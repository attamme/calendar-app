import type { ReactNode } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import TopBar from "@/components/TopBar";
import { theme } from "@/theme/tokens";

type ScreenShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  showBackButton?: boolean;
  tone?: "light" | "figma";
};

export default function ScreenShell({
  title,
  subtitle,
  children,
  footer,
  showBackButton = false,
  tone = "light",
}: ScreenShellProps) {
  const router = useRouter();
  const palette = tone === "figma" ? figmaPalette : lightPalette;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {showBackButton ? (
          <TopBar
            onBack={() => {
              if (router.canGoBack()) {
                router.back();
                return;
              }

              router.replace("/");
            }}
            subtitle={subtitle}
            title={title}
            tone={tone}
          />
        ) : (
          <View style={styles.header}>
            <Text style={[styles.title, { color: palette.title }]}>{title}</Text>
            <Text style={[styles.subtitle, { color: palette.subtitle }]}>{subtitle}</Text>
          </View>
        )}
        <View style={styles.body}>{children}</View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  header: {
    gap: 8,
    paddingTop: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    lineHeight: 22,
  },
  body: {
    gap: 18,
  },
  footer: {
    paddingBottom: 24,
  },
});

const lightPalette = {
  background: theme.colors.background,
  title: theme.colors.textPrimary,
  subtitle: theme.colors.textSecondary,
} as const;

const figmaPalette = {
  background: theme.colors.figmaMain,
  title: theme.colors.figmaText,
  subtitle: theme.colors.figmaSubtext,
} as const;
