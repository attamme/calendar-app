import { useState } from "react";
import { View, Text, Keyboard, KeyboardAvoidingView, Pressable, Platform } from "react-native";
import InputText from "@/components/InputText";
import Button from "@/components/button";
import { styles } from "@/styles/login";
import { useRouter } from "expo-router";
import login from "@/services/authLogin";
export default function Login() {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function handleLogin() {
        console.log("Logging in with", email, password)
        login(email, password).then(() => {
            router.replace("/home")
        }).catch((err) => {
            console.error(err)
        })
    }



    return (
       < KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.mainText}>Good day, sire.</Text>
                    <Text style={styles.subText}>Log in to your account</Text>
                    <InputText label="E-mail" placeholder="example@gmail.com" value={email} onChangeText={setEmail} />
                    <InputText label="Password" placeholder="***********" secure value={password} onChangeText={setPassword} />
                    <View style={styles.buttonContainer}>
                        <Button title="Register" onPress={ () => router.push("/register")}/>
                        <Button title="Login" onPress={ () => handleLogin()}/>
                    </View>
                    <Text style={[styles.link, { textAlign: "right" }]}>Login as a guest</Text>
                    <Text style={[styles.link, { textDecorationLine: "underline" }]}>Terms of service</Text>
                    <Text style={[styles.link, { textDecorationLine: "underline" }]}>Privacy policy</Text>
                </View>
            </Pressable>
       </KeyboardAvoidingView>
    )
}