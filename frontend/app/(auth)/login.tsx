import { useState } from "react";
import { View, Text, Keyboard, KeyboardAvoidingView, Pressable, Platform } from "react-native";
import InputText from "@/components/InputText";
import Button from "@/components/button";
import { styles } from "@/styles/login";
import { router } from "expo-router";

export default function Login() {

    

    return (
       < KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.mainText}>Good day, sire.</Text>
                    <Text style={styles.subText}>Log in to your account</Text>
                    <InputText label="E-mail" placeholder="example@gmail.com"/>
                    <InputText label="Password" placeholder="***********" secure/>
                    <View style={styles.buttonContainer}>
                        <Button title="Register" onPress={ () => router.navigate("/register")}/>
                        <Button title="Login" onPress={ () => alert("You are trying to login")}/>
                    </View>
                    <Text style={[styles.link, { textAlign: "right" }]}>Login as a guest</Text>
                    <Text style={[styles.link, { textDecorationLine: "underline" }]}>Terms of service</Text>
                    <Text style={[styles.link, { textDecorationLine: "underline" }]}>Privacy policy</Text>
                </View>
            </Pressable>
       </KeyboardAvoidingView>
    )
}