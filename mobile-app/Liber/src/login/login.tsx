import React from "react";

import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import styles from "../../styles/styles";
import colors from "../../styles/colors";
import { Button } from "react-native-elements";

export default function LoginScreen({ navigation }): React.JSX.Element {
  const onLoginPress = () => {
    navigation.navigate('Dashboard');
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
