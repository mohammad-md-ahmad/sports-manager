import React, { useState } from "react";

import {
    Keyboard,
    KeyboardAvoidingView,
    Image,
    TextInput,
    TouchableWithoutFeedback,
    View,
    StyleSheet,
    Text,
    Switch,
    Platform,
    ScrollView,
    Dimensions,
} from "react-native";
import colors, { placeHolderTextColor } from "../../styles/styles";
import { Button } from "react-native-elements";
import globalStyles from "../../styles/styles";
import RegisterService from "../../api/RegisterService";
import { useNavigation } from "@react-navigation/native";

interface UserFormData {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
}


interface CompanyFormData {
    name: string;
    createUserRequest: {
        first_name: string;
        last_name: string;
        username: string;
        email: string;
        password: string;
        password_confirmation: string;
    };
}

export default function Signup(): React.JSX.Element {

    let registerService = new RegisterService();

    const navigator = useNavigation();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        name: '',
        is_company: false,
    });

    const handleInputChange = (key: string, value: any) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    }
    const onSignupPress = () => {
        if (formData.is_company) {
            const companyFormData: CompanyFormData = {
                ...formData,
                createUserRequest: {
                    ...formData
                }
            };
            
            registerService.createCompany(companyFormData).then((response) => {
                // Handle a successful API response
                //console.log('Success signup:', response.data);

                navigator.navigate('Login');
            })
                .catch((error) => {
                    // Handle API request errors here
                    //console.error('Error signup:', error);
                });
        } else {
            const userFormData: UserFormData = {
                ...formData,
            };

            registerService.createUser(userFormData).then((response) => {
                // Handle a successful API response
                //console.log('Success signup:', response.data);

                navigator.navigate('Login');

            })
                .catch((error) => {
                    // Handle API request errors here
                    //console.error('Error signup:', error);
                });

        }
    };

    return (
        <ScrollView style={styles.scrollView}>
            {/* <KeyboardAvoidingView style={styles.containerView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
            <View style={styles.formContainer}>
                <View style={styles.formView}>
                    <View style={styles.imageConatiner} >
                        <Image
                            source={require('./../../assets/images/liber_logo.png')}
                            style={styles.logo}
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            placeholder="First Name"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.first_name}
                            onChangeText={(text) => handleInputChange('first_name', text)}
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            placeholder="Last Name"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.last_name}
                            onChangeText={(text) => handleInputChange('last_name', text)}
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            placeholder="Username"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.username}
                            onChangeText={(text) => handleInputChange('username', text)}
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.email}
                            onChangeText={(text) => handleInputChange('email', text)}
                        />

                    </View>

                    <View>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            secureTextEntry={true}
                            value={formData.password}
                            onChangeText={(text) => handleInputChange('password', text)}
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            placeholder="Confirm Password"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            secureTextEntry={true}
                            value={formData.password_confirmation}
                            onChangeText={(text) => handleInputChange('password_confirmation', text)}
                        />
                    </View>

                    <View style={styles.switchContainer}>
                        <Text style={styles.label}>Is Company</Text>
                        <Switch
                            value={formData.is_company}
                            onValueChange={() => { handleInputChange('is_company', !formData.is_company) }}
                            trackColor={{ false: colors.PrimaryBlueLight, true: colors.PrimaryBlueLight }}
                            thumbColor={formData.is_company ? colors.PrimaryBlue : colors.OffWhite}
                        />
                    </View>

                    {formData.is_company &&
                        < View >
                            <TextInput
                                placeholder="Company Name"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.formTextInput}
                                value={formData.name}
                                onChangeText={(text) => handleInputChange('name', text)}
                            />
                        </View>
                    }

                    <Button
                        onPress={() => onSignupPress()}
                        title="Signup"
                        buttonStyle={styles.button}
                    />
                </View>
            </View>
            {/* </TouchableWithoutFeedback>
            </KeyboardAvoidingView > */}
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    containerView: {
    },
    formContainer: {
        padding: 16
    },
    formView: {

    },
    formTextInput: {
        ...globalStyles.inputText
    },
    button: {
        ...globalStyles.button,
        width: '100%'
    },
    imageConatiner: {
        alignItems: "center",
    },
    logo: {
        marginBottom: 10,
        width: 150,
        height: 120,
        resizeMode: 'contain',
    },
    label: {
        ...globalStyles.inputTextLabel
    },
    container: {
        flex: 1,
        padding: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

