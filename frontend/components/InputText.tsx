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
  label: string;
  placeholder: string;
  value?: string;
  secure?: boolean;
  multiline?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: KeyboardTypeOptions;
  onChangeText?: (text: string) => void;
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
}: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const showEye = Boolean(secure);
  const EyeIcon = isPasswordVisible ? EyeOpen : EyeClosed;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, multiline ? styles.multilineContainer : null]}>
        <TextInput
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={secure ? !isPasswordVisible : false}
          style={[styles.input, multiline ? styles.multilineInput : null]}
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
