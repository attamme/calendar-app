import { Keyboard, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "@/styles/input_text";
import { useMemo, useRef, useState } from "react";

import EyeOpen from "@/assets/svg/eye_open.svg"
import EyeClosed from "@/assets/svg/eye_closed.svg"

type Props = {
    label: string;
    placeholder: string;
    value?: string;
    secure?: boolean;
}

export default function InputText ({ label, placeholder, value, secure } : Props ) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const showEye = !!secure
    const secureTextEntry = secure ? !isPasswordVisible : false

    const EyeIcon = useMemo(() => {
        if(!showEye) return null
        return isPasswordVisible ? EyeOpen : EyeClosed
    }, [showEye, isPasswordVisible])

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <TextInput secureTextEntry={secureTextEntry} value={value} placeholder={placeholder} style={styles.input} />
                { showEye && EyeIcon && (
                    <Pressable onPress={() => setIsPasswordVisible((v) => !v)}>
                        <EyeIcon style={styles.eye} />
                    </Pressable>
                )}
            </View>
        </View>

    )
}