import { useState } from "react";
import { View, Text, Keyboard, KeyboardAvoidingView, Pressable, Platform, ScrollView } from "react-native";
import InputText from "@/components/InputText";
import Button from "@/components/button";
import { styles } from "@/styles/register";
import { colors } from "@/styles/colors";

export default function Register() {

    

    return (
       <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.primary }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Pressable onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.mainText}>New account</Text>
                    <Text style={styles.subText}>Register a new account</Text>
                    <InputText label="Username" placeholder="Username" />
                    <InputText label="E-mail" placeholder="example@gmail.com"/>
                    <InputText label="Password" placeholder="***********" secure/>
                    <InputText label="Repeat password" placeholder="***********" secure/>
                    <View style={styles.buttonContainer}>
                        <Button title="Register" onPress={ () => alert("You are trying to register")}/>
                    </View>
                    <View style={styles.bottomLinks}>
                        <Text style={[styles.link, { textAlign: "left" }]}>Already have an account?</Text>
                        <Text style={[styles.link, { textAlign: "right" }]}>Login as a guest</Text>
                    </View>
                </View>
            </Pressable>
        </ScrollView>
       </KeyboardAvoidingView>
    )
}