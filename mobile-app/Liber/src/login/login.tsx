import React from "react";

import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import styles from "../../styles/main";
import colors from "../../styles/colors";

export default function LoginScreen({ navigation }): React.JSX.Element {
  const onLoginPress = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <Image
              source={require('./../../assets/images/liber_logo.png')}
              style={styles.logo}
            />
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
              color={colors.PrimaryBlue}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
