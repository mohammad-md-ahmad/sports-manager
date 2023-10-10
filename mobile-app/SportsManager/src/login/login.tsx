import React from "react";

import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import styles from "../../styles/main";

export default function LoginScreen({ navigation }) {
  const onLoginPress = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <Text style={styles.logoText}>Instamobile</Text>
            <TextInput
              placeholder="Username"
              style={styles.loginFormTextInput}
            />
            <TextInput
              placeholder="Password"
              style={styles.loginFormTextInput}
              secureTextEntry={true}
            />
            <Button
              onPress={() => onLoginPress()}
              title="Login"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
