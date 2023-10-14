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
import colors from "../../styles/colors";
import { Button } from "react-native-elements";
import AuthService from "../../api/AuthService";

import { useAuth } from "../../AuhtContext";
import globalStyles from "../../styles/styles";

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
    width: 206,
  },
  loginFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.PrimaryBlue,
    backgroundColor: colors.PrimaryGreen,
    color: colors.White,
    paddingLeft: 10,
    marginTop: 5,
    marginBottom: 5
  },
  loginButton: {
    ...globalStyles.button,
    backgroundColor: colors.PrimaryBlue,
    borderRadius: 5,
    height: 45,
    marginTop: 10,
    alignItems: "center"
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
            <View style={styles.imageConatiner} >
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

