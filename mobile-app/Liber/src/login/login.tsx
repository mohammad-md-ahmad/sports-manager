import React, { useState } from "react";

import {
  Keyboard,
  KeyboardAvoidingView,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import styles from "../../styles/styles";
import colors from "../../styles/colors";
import { Button } from "react-native-elements";
import AuthService from "../../api/AuthService";

import { useAuth } from "../../AuhtContext";
import { useLoading } from "../../LoadingContext";


export default function LoginScreen(): React.JSX.Element {

  const authService = new AuthService();

  const [username, setUsername] = useState('super_admin');
  const [password, setPassword] = useState('P@ssw0rd');

  const { login } = useAuth();
  const onLoginPress = () => {
    authService.login(username, password).then((response) => {
      // Handle a successful API response
      console.log('Error creating user:', response.data.data.token);
      login(response.data.data.token);
    })
      .catch((error) => {
        // Handle API request errors here
        console.error('Error creating user:', error);
      });

  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <View style={styles.drawerImageConatiner} >
              <Image
                source={require('./../../assets/images/liber_logo.png')}
                style={styles.logo}
              />
            </View>
            <TextInput
              placeholder="Username"
              placeholderTextColor={colors.OffWhite}
              style={styles.loginFormTextInput}
              value={username}
              onChangeText={(text) => setUsername(text)}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.OffWhite}
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
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
