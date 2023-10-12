import React from "react";

import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  Image,Alert,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import styles from "../../styles/styles";
import colors from "../../styles/colors";
import { Button } from "react-native-elements";
import AuthService from "../../api/AuthService";

export default function LoginScreen({ navigation }): React.JSX.Element {

  const authService = new AuthService();

  const onLoginPress = () => {
    authService.login('super_admin', 'P@ssw0rd').then((response) => {
      // Handle a successful API response
      console.log('User created:', response.data);
      navigation.navigate('Dashboard');
    })
      .catch((error) => {
        // Handle API request errors here
        console.error('Error creating user:', error);
      });;

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
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.OffWhite}
              style={styles.loginFormTextInput}
              secureTextEntry={true}
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
