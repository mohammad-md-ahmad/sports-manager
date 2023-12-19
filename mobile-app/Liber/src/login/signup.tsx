import React, { useState } from "react";

import {
    Image,
    TextInput,
    View,
    StyleSheet,
    Text,
    Switch,
    ScrollView,
} from "react-native";
import colors, { placeHolderTextColor } from "../../styles/styles";
import { Button } from "react-native-elements";
import globalStyles from "../../styles/styles";
import RegisterService from "../../api/RegisterService";
import { useNavigation } from "@react-navigation/native";
import { Screens, UserType } from "../../helpers/constants";
import ErrorView from "../common/errorView";
import { OneSignal } from "react-native-onesignal";

interface UserFormData {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    type: string;
    password: string;
    password_confirmation: string;
    pushSubscriptionId: string;
}

interface CompanyFormData {
    name: string;
    createUserRequest: {
        first_name: string;
        last_name: string;
        username: string;
        email: string;
        type: string;
        pushSubscriptionId: string;
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
        type: '',
        is_company: false,
    });

    const [errors, setErrors] = useState(null);

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
                    ...formData,
                    type: UserType.CompanyUser,
                    pushSubscriptionId: OneSignal.User.pushSubscription.getPushSubscriptionId()
                }
            };

            registerService.createCompany(companyFormData)
                .then((response) => {
                    // Handle a successful API response
                    navigator.navigate(Screens.Login);
                })
                .catch((error) => {
                    setErrors(error.response.data.errors)
                    // Handle API request errors here
                });
        } else {
            const userFormData: UserFormData = {
                ...formData,
                type: UserType.CustomerUser,
                pushSubscriptionId: OneSignal.User.pushSubscription.getPushSubscriptionId()
            };

            registerService.createUser(userFormData)
                .then((response) => {
                    // Handle a successful API response
                    navigator.navigate(Screens.Login);
                })
                .catch((error) => {
                    console.log('error ****************************** ', error)
                    setErrors(error.response.data.errors)
                    // Handle API request errors here
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

                    {errors != null ? <ErrorView errorData={errors} /> : <></>}

                    <View>
                        <TextInput
                            placeholder="First Name"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.first_name}
                            onChangeText={(text) => handleInputChange('first_name', text)}
                        />
                    </View>

                    <View>
                        <TextInput
                            placeholder="Last Name"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.last_name}
                            onChangeText={(text) => handleInputChange('last_name', text)}
                        />
                    </View>

                    <View>
                        <TextInput
                            placeholder="Username"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.username}
                            onChangeText={(text) => handleInputChange('username', text)}
                        />
                    </View>

                    <View>
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.email}
                            onChangeText={(text) => handleInputChange('email', text)}
                        />

                    </View>

                    <View>
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

