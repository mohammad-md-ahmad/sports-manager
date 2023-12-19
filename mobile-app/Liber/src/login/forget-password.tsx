import React, { useState } from "react";

import {
    Image,
    TextInput,
    View,
    StyleSheet,
    Text,
    ScrollView,
} from "react-native";
import { placeHolderTextColor } from "../../styles/styles";
import { Button } from "react-native-elements";
import globalStyles from "../../styles/styles";
import { useNavigation } from "@react-navigation/native";
import ErrorView from "../common/errorView";
import colors from "../../styles/colors";
import AuthService from "../../api/AuthService";
import { Screens } from "../../helpers/constants";

export default function ForgetPassword(): React.JSX.Element {
    let authService = new AuthService();

    const navigator = useNavigation();

    const [formData, setFormData] = useState({
        email: '',
    });

    const [successResponseMessage, setSuccessResponseMessage] = useState(null);

    const [errors, setErrors] = useState(null);

    const handleInputChange = (key: string, value: any) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    }

    const onSubmitPress = () => {
        authService.sendResetPasswordLink(formData)
            .then((response) => {
                setSuccessResponseMessage(response.data?.message);
                console.log('RESSSSS', response);
            })
            .catch((error) => {
                console.log('error ****************************** ', error)
                setErrors(error.response.data.errors)
            });
    };

    const onGoToLoginPress = () => {
        navigator.navigate(Screens.Login);
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.formContainer}>
                <View style={styles.formView}>
                    <View style={styles.imageConatiner} >
                        <Image
                            source={require('./../../assets/images/liber_logo.png')}
                            style={styles.logo}
                        />
                    </View>

                    {
                        successResponseMessage ?
                            <>
                                <Text style={{
                                    color: colors.PrimaryBlue,
                                    marginVertical: 12,
                                }}>
                                    {successResponseMessage}
                                </Text>

                                <Button
                                    onPress={() => onGoToLoginPress()}
                                    title="Go To Login"
                                    buttonStyle={styles.button}
                                />
                            </> :
                            <>
                                {errors != null ? <ErrorView errorData={errors} /> : <></>}

                                <Text style={{
                                    color: colors.PrimaryBlue,
                                    marginVertical: 12,
                                }}>
                                    We will send a reset password link to the email you enter below.
                                </Text>

                                <View>
                                    <TextInput
                                        placeholder="Email"
                                        placeholderTextColor={placeHolderTextColor}
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
                            </>
                    }
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
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
});
