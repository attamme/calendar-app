import { useState } from "react";
import {
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import EyeClosed from "@/assets/svg/eye_closed.svg";
import EyeOpen from "@/assets/svg/eye_open.svg";
import { theme } from "@/theme/tokens";

type Props = {
  label?: string;
  placeholder: string;
  value?: string;
  secure?: boolean;
  multiline?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: KeyboardTypeOptions;
  onChangeText?: (text: string) => void;
  variant?: "default" | "figma";
  hideLabel?: boolean;
};

export default function InputText({
  label,
  placeholder,
  value,
  secure,
  multiline,
  autoCapitalize = "sentences",
  keyboardType = "default",
  onChangeText,
  variant = "default",
  hideLabel = false,
}: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const showEye = Boolean(secure);
  const EyeIcon = isPasswordVisible ? EyeOpen : EyeClosed;
  const palette = variant === "figma" ? figmaPalette : defaultPalette;

  return (
    <View style={styles.container}>
      {label && !hideLabel ? <Text style={[styles.label, { color: palette.label }]}>{label}</Text> : null}
      <View
        style={[
          styles.inputContainer,
          multiline ? styles.multilineContainer : null,
          {
            backgroundColor: palette.background,
            borderColor: palette.borderColor,
            borderWidth: palette.borderWidth,
          },
        ]}
      >
        <TextInput
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.placeholder}
          secureTextEntry={secure ? !isPasswordVisible : false}
          style={[
            styles.input,
            multiline ? styles.multilineInput : null,
            { color: palette.text },
          ]}
          value={value}
        />
        {showEye ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => setIsPasswordVisible((current) => !current)}
            style={styles.eyeButton}
          >
            <EyeIcon height={22} width={22} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  inputContainer: {
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: "row",
    alignItems: "center",
  },
  multilineContainer: {
    alignItems: "flex-start",
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: theme.colors.textPrimary,
    fontSize: 15,
  },
  multilineInput: {
    minHeight: 112,
    textAlignVertical: "top",
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});

const defaultPalette = {
  label: theme.colors.textSecondary,
  background: theme.colors.surfaceMuted,
  borderColor: theme.colors.border,
  borderWidth: 1,
  text: theme.colors.textPrimary,
  placeholder: theme.colors.textMuted,
} as const;

const figmaPalette = {
  label: theme.colors.figmaText,
  background: theme.colors.figmaSurfaceAlt,
  borderColor: theme.colors.border,
  borderWidth: 1,
  text: theme.colors.figmaText,
  placeholder: theme.colors.figmaSubtext,
} as const;
