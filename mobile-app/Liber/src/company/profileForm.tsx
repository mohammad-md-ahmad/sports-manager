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
import CompanyService from "../../api/CompanyService";
import colors from "../../styles/colors";
import { Button } from "react-native-elements";

interface CompanyFormData {
  name: string;
}


export default function ProfileForm(): React.JSX.Element {

  let companyService = new CompanyService();

  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    description: '',
    createAddressRequest: {
      line_1: '',
      line_2: '',
      line_3: '',
      city: '',
      region: '',
      postcode: '',
      country_uuid: '',
    },
  });

  const handleInputChange = (key: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  }

  function onSubmitPress(): void {
    throw new Error("Function not implemented.");
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
                <Text style={styles.label}>Company Name</Text>
                <TextInput
                  placeholder="Company Name"
                  placeholderTextColor={colors.OffWhite}
                  style={styles.formTextInput}
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                />
              </View>

              <View>
                <Text style={styles.label}>Company Name Ar</Text>
                <TextInput
                  placeholder="Company Name Ar"
                  placeholderTextColor={colors.OffWhite}
                  style={styles.formTextInput}
                  value={formData.name_ar}
                  onChangeText={(text) => handleInputChange('name_ar', text)}
                />
              </View>

              <View>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  placeholder="Description"
                  placeholderTextColor={colors.OffWhite}
                  style={styles.formTextInput}
                  value={formData.description}
                  onChangeText={(text) => handleInputChange('description', text)}
                />
              </View>

              <View>
                <Text style={styles.label}>Line 1</Text>
                <TextInput
                  value={formData.createAddressRequest.line_1}
                  onChangeText={(text) => handleInputChange('createAddressRequest.line_1', text)}
                  placeholder="Line 1"
                  style={styles.formTextInput}
                />
              </View>

              <View>
                <Text style={styles.label}>Line 2</Text>
                <TextInput
                  value={formData.createAddressRequest.line_2}
                  onChangeText={(text) => handleInputChange('createAddressRequest.line_2', text)}
                  placeholder="Line 2"
                  style={styles.formTextInput}
                />
              </View>

              <View>
                <Text style={styles.label}>Line 3</Text>
                <TextInput
                  value={formData.createAddressRequest.line_3}
                  onChangeText={(text) => handleInputChange('createAddressRequest.line_3', text)}
                  placeholder="Line 3"
                  style={styles.formTextInput}
                />
              </View>

              <View>
                <Text style={styles.label}>City</Text>
                <TextInput
                  value={formData.createAddressRequest.city}
                  onChangeText={(text) => handleInputChange('createAddressRequest.city', text)}
                  placeholder="City"
                  style={styles.formTextInput}
                />
              </View>

              <View>
                <Text style={styles.label}>Region</Text>
                <TextInput
                  value={formData.createAddressRequest.region}
                  onChangeText={(text) => handleInputChange('createAddressRequest.region', text)}
                  placeholder="Region / State"
                  style={styles.formTextInput}
                />
              </View>

              <View>
                <Text style={styles.label}>Postcode</Text>
                <TextInput
                  value={formData.createAddressRequest.postcode}
                  onChangeText={(text) => handleInputChange('createAddressRequest.postcode', text)}
                  placeholder="Post Code"
                  style={styles.formTextInput}
                />
              </View>

              <View>
                <Text style={styles.label}>Country</Text>
                <TextInput
                  value={formData.createAddressRequest.country_uuid}
                  onChangeText={(text) => handleInputChange('createAddressRequest.country_uuid', text)}
                  placeholder="Country"
                  style={styles.formTextInput}
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

