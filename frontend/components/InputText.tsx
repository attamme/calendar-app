import { ElementType, createElement, useMemo, useState } from "react";
import { KeyboardTypeOptions, Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import EyeClosed from "@/assets/svg/eye_closed.svg";
import EyeOpen from "@/assets/svg/eye_open.svg";
import { colors } from "@/styles/tokens";
import { styles } from "@/styles/input_text";

type Props = {
  label: string;
  placeholder: string;
  value?: string;
  secure?: boolean;
  onChangeText?: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  labelHidden?: boolean;
  testID?: string;
};

export default function InputText({
  label,
  placeholder,
  value,
  secure,
  onChangeText,
  keyboardType,
  autoCapitalize,
  labelHidden,
  testID,
}: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const showEye = Boolean(secure);
  const secureTextEntry = secure ? !isPasswordVisible : false;

  function resolveIconComponent(icon: unknown): ElementType | null {
    if (typeof icon === "function" || typeof icon === "string") {
      return icon as ElementType;
    }

    if (
      icon &&
      typeof icon === "object" &&
      "default" in icon &&
      (typeof icon.default === "function" || typeof icon.default === "string")
    ) {
      return icon.default as ElementType;
    }

    return null;
  }

  const EyeIcon = useMemo(() => {
    if (!showEye) {
      return null;
    }

    return resolveIconComponent(isPasswordVisible ? EyeOpen : EyeClosed);
  }, [isPasswordVisible, showEye]);

  return (
    <View style={styles.container}>
      {labelHidden ? null : <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry}
          style={styles.input}
          testID={testID}
          value={value}
        />
        {showEye && EyeIcon ? (
          <Pressable onPress={() => setIsPasswordVisible((visible) => !visible)}>
            {createElement(EyeIcon, { style: styles.eye })}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
