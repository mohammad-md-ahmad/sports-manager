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
import colors from "../../styles/colors";
import { Button } from "react-native-elements";
import globalStyles from "../../styles/styles";


export default function Signup(): React.JSX.Element {

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
        company_name: '',
        is_company: false
    });

    const handelInputChange = (key: string, value: any) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    }
    const onSignupPress = () => {
        console.log(formData);
        // authService.login(username, password).then((response) => {
        //     // Handle a successful API response
        //     console.log('Error creating user:', response.data.data.token);
        //     login(response.data.data.token);
        // })
        //     .catch((error) => {
        //         // Handle API request errors here
        //         console.error('Error creating user:', error);
        //     });
    };

    return (
        <ScrollView style={styles.scrollView}>
            <KeyboardAvoidingView style={styles.containerView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.loginScreenContainer}>
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
                                    placeholderTextColor={colors.OffWhite}
                                    style={styles.formTextInput}
                                    value={formData.first_name}
                                    onChangeText={(text) => handelInputChange('first_name', text)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Last Name</Text>
                                <TextInput
                                    placeholder="Last Name"
                                    placeholderTextColor={colors.OffWhite}
                                    style={styles.formTextInput}
                                    value={formData.last_name}
                                    onChangeText={(text) => handelInputChange('last_name', text)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    placeholder="Email"
                                    placeholderTextColor={colors.OffWhite}
                                    style={styles.formTextInput}
                                    value={formData.email}
                                    onChangeText={(text) => handelInputChange('email', text)}
                                />

                            </View>

                            <View>
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    placeholder="Password"
                                    placeholderTextColor={colors.OffWhite}
                                    style={styles.formTextInput}
                                    secureTextEntry={true}
                                    value={formData.password}
                                    onChangeText={(text) => handelInputChange('password', text)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Confirm Password</Text>
                                <TextInput
                                    placeholder="Confirm Password"
                                    placeholderTextColor={colors.OffWhite}
                                    style={styles.formTextInput}
                                    secureTextEntry={true}
                                    value={formData.confirm_password}
                                    onChangeText={(text) => handelInputChange('confirm_password', text)}
                                />
                            </View>

                            <View style={styles.switchContainer}>
                                <Text style={styles.label}>Is Company</Text>
                                <Switch
                                    value={formData.is_company}
                                    onValueChange={() => { handelInputChange('is_company', !formData.is_company) }}
                                    trackColor={{ false: colors.OffWhite, true: colors.PrimaryGreen }}
                                    thumbColor={formData.is_company ? colors.PrimaryBlue : colors.OffWhite}
                                />
                            </View>

                            {formData.is_company &&
                                < View >
                                    <TextInput
                                        placeholder="Company Name"
                                        placeholderTextColor={colors.OffWhite}
                                        style={styles.formTextInput}
                                        value={formData.company_name}
                                        onChangeText={(text) => handelInputChange('company_name', text)}
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
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView >
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    containerView: {
        flex: 1,
        height: Dimensions.get('window').height - 60,
        alignItems: "center",
        backgroundColor: colors.White,
    },
    loginScreenContainer: {
        flex: 1,
    },
    formView: {
        flex: 1,
        width: 250,
    },
    formTextInput: {
        ...globalStyles.inputText
    },
    button: {
        ...globalStyles.button,
        width: 250,
    },
    imageConatiner: {
        alignItems: "center",
        marginTop: 10,
    },
    logo: {
        marginBottom: 10,
        width: 150,
        height: 120,
        resizeMode: 'contain',
    },
    label: {
        fontSize: 16,
        color: 'gray',
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

