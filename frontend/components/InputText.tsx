import { useMemo, useState } from "react";
import { KeyboardTypeOptions, Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import EyeClosed from "@/assets/svg/eye_closed.svg";
import EyeOpen from "@/assets/svg/eye_open.svg";
import { styles } from "@/styles/input_text";

type Props = {
  label: string;
  placeholder: string;
  value?: string;
  secure?: boolean;
  onChangeText?: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps["autoCapitalize"];
};

export default function InputText({
  label,
  placeholder,
  value,
  secure,
  onChangeText,
  keyboardType,
  autoCapitalize,
}: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const showEye = Boolean(secure);
  const secureTextEntry = secure ? !isPasswordVisible : false;

  const EyeIcon = useMemo(() => {
    if (!showEye) {
      return null;
    }

    return isPasswordVisible ? EyeOpen : EyeClosed;
  }, [isPasswordVisible, showEye]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9D9D9D"
          secureTextEntry={secureTextEntry}
          style={styles.input}
          value={value}
        />
        {showEye && EyeIcon ? (
          <Pressable onPress={() => setIsPasswordVisible((visible) => !visible)}>
            <EyeIcon style={styles.eye} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
