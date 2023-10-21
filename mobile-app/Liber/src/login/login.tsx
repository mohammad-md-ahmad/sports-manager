import React, { useState } from "react";

import {
    Keyboard,
    KeyboardAvoidingView,
    Image,
    TextInput,
    TouchableWithoutFeedback,
    View,
    StyleSheet,
} from "react-native";
import colors, { placeHolderTextColor } from "../../styles/styles";
import { Button } from "react-native-elements";
import AuthService from "../../api/AuthService";
import { useAuth } from "../../AuhtContext";
import globalStyles from "../../styles/styles";
import { useNavigation } from "@react-navigation/native";
import BaseComponent from "../common/baseComponent";

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        alignItems: "center",
        backgroundColor: colors.White,
    },
    loginScreenContainer: {
        flex: 1,
    },
    loginFormView: {
        flex: 1,
        width: 250,
    },
    loginFormTextInput: {
        ...globalStyles.inputText
    },
    loginButton: {
        ...globalStyles.button,
        width: 250,
    },
    imageConatiner: {
        alignItems: "center",
        marginTop: 10,
    },
    logo: {
        marginTop: 100,
        marginBottom: 30,
        width: 150,
        height: 120,
        resizeMode: 'contain',
    },
});

export default function LoginScreen(): React.JSX.Element {
    const authService = new AuthService();

    const navigator = useNavigation();

    const [username, setUsername] = useState('super_admin');
    const [password, setPassword] = useState('P@ssw0rd');

    const { login } = useAuth();

    const onLoginPress = () => {
        authService.login(username, password).then((response) => {
            // Handle a successful API response
            login(response.data.data);

        }).catch((error) => {
            // Handle API request errors here
            console.error('Error signin:', error);
        });
    };

    function onSignupPress(): void {
        navigator.navigate('Signup');
    }

    return (
        <BaseComponent>
            <KeyboardAvoidingView style={styles.containerView} behavior="padding">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.loginScreenContainer}>
                        <View style={styles.loginFormView}>
                            <View style={styles.imageConatiner} >
                                <Image
                                    source={require('./../../assets/images/liber_logo.png')}
                                    style={styles.logo}
                                />
                            </View>
                            <TextInput
                                placeholder="Username"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.loginFormTextInput}
                                value={username}
                                onChangeText={(text) => setUsername(text)}
                            />
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.loginFormTextInput}
                                secureTextEntry={true}
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                            />
                            <Button
                                onPress={() => onLoginPress()}
                                title="Login"
                                buttonStyle={styles.loginButton}
                            />
                            <Button
                                onPress={() => onSignupPress()}
                                title="Signup"
                                buttonStyle={styles.loginButton}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </BaseComponent>
    );
}
