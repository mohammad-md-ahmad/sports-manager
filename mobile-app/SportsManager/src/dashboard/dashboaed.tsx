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

export default function Dashboard({ navigation }) {
    const onLoginPress = () => {
      navigation.navigate('Login Screen');
      };
  return (
    <View style={styles.containerView}>
          <Text>here is the dashboard</Text>
         <Button
              onPress={() => onLoginPress()}
              title="back"
            />
    </View>
  );
}
