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
import styles from "../../styles/styles";
import colors from "../../styles/colors";

export default function Dashboard({ navigation }): React.JSX.Element {
  const onLoginPress = () => {
    navigation.navigate('LoginScreen');
  };
  return (
    <View style={styles.containerView}>
      <Text style={styles.text}>here is the dashboard</Text>
      <Button
        onPress={() => onLoginPress()}
        title="back"
        color={colors.PrimaryBlue}
      />
    </View>
  );
}
