import { Keyboard, Pressable, TextInput } from "react-native";
import { styles } from "@/styles/input_text";
import { useRef } from "react";

type Props = {
    placeholder: string;
}

export default function InputText ({ placeholder } : Props ) {
    const inputRef = useRef<TextInput>(null);

    return (
        <Pressable style={styles.inputText} onPress={() => inputRef.current?.focus()} onPressOut={() => Keyboard.dismiss()}>
            <TextInput placeholder={placeholder} style={styles.text} ref={inputRef} />
        </Pressable>
    )
}