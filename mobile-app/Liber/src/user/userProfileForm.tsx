import React, { useState } from "react";

import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import globalStyles from "../../styles/styles";
import colors from "../../styles/colors";
import { Button } from "react-native-elements";
import UserService from "../../api/UserService";

interface UserFormData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function UserProfileForm(): React.JSX.Element {

  let userService = new UserService();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
  });

  const handleInputChange = (key: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  }

  function onSubmitPress(): void {
    userService.create(formData).then((response) => {
      // Handle a successful API response
      console.log('Success signup:', response.data);
    })
      .catch((error) => {
        // Handle API request errors here
        console.error('Error signup:', error);
      });

  }

  return (
    <ScrollView style={styles.scrollView}>
      <KeyboardAvoidingView style={styles.containerView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.formContainer}>
            <View style={styles.formView}>

              <View>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  placeholder="First Name"
                  placeholderTextColor={colors.PrimaryBlueLight}
                  style={styles.formTextInput}
                  value={formData.first_name}
                  onChangeText={(text) => handleInputChange('first_name', text)}
                />
              </View>

              <View>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  placeholder="Last Name"
                  placeholderTextColor={colors.PrimaryBlueLight}
                  style={styles.formTextInput}
                  value={formData.last_name}
                  onChangeText={(text) => handleInputChange('last_name', text)}
                />
              </View>

              <View>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  placeholder="Username"
                  placeholderTextColor={colors.PrimaryBlueLight}
                  style={styles.formTextInput}
                  value={formData.username}
                  onChangeText={(text) => handleInputChange('username', text)}
                />
              </View>

              <View>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  placeholder="Email"
                  placeholderTextColor={colors.PrimaryBlueLight}
                  style={styles.formTextInput}
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                />

              </View>



              <Button
                onPress={() => onSubmitPress()}
                title="Submit"
                buttonStyle={styles.button}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  containerView: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    flex: 1,
  },
  formView: {
    flex: 1,
  },
  formTextInput: {
    ...globalStyles.inputText
  },
  button: {
    ...globalStyles.button,
    width: '100%'
  },

  label: {
    ...globalStyles.inputTextLabel
  },
});

