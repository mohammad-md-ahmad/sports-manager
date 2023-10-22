import React, { useEffect, useState } from "react";

import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import globalStyles from "../../styles/styles";
import colors, { placeHolderTextColor } from "../../styles/styles";
import { Button, Icon } from "react-native-elements";
import UserService from "../../api/UserService";
import { launchImageLibrary } from "react-native-image-picker";
import Constants from "../../helpers/constants";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

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
    const navigator = useNavigation();

    const [logo, setLogo] = useState(require('./../../assets/images/liber_logo.png'));
    const [formData, setFormData] = useState({
        uuid: null,
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        profile_picture: null,
    });

    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.

            userService.getUser().then((response) => {
                setFormData({ ...response.data.data, profile_picture: null });
                setLogo({ uri: response.data?.data?.profile_picture });
            }).catch((error) => {
                console.error('user error', error)
            });
        }, [])
    );


    const handleInputChange = (key: string, value: any) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    }

    function onSubmitPress(): void {
        console.log(formData);
        userService.update(formData).then((response) => {
            // Handle a successful API response
            navigator.navigate('UserProfile');
        })
            .catch((error) => {
                // Handle API request errors here
                console.error('Error signup:', error);
            });

    }

    const selectImage = async () => {
        const options = {
            title: 'Select Profile Picture',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            includeBase64: true
        };
        const result = await launchImageLibrary(options);
        if (result.assets) {
            setLogo(result.assets);
            setFormData((prevData) => ({
                ...prevData,
                ['profile_picture']: result.assets[0].base64,
            }));
        }
    };

    async function onImageBrowsePress(): Promise<void> {
        await selectImage();
    }


    return (
        <ScrollView style={styles.scrollView}>
            <KeyboardAvoidingView style={styles.containerView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.formContainer}>
                        <View style={styles.formView}>

                            <View style={styles.imageContainer}>
                                <Image source={logo} style={styles.logo} />

                                <TouchableOpacity style={styles.iconContainer}>
                                    <Icon
                                        name="camera" // Replace with your desired icon name
                                        type="font-awesome" // Replace with your desired icon library
                                        size={40}
                                        color={colors.PrimaryGreen}
                                        onPress={() => onImageBrowsePress()}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* <TextInput
                caretHidden={true}
                value={formData.uuid}
              /> */}

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
    logo: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
        borderWidth: 0,
        resizeMode: 'contain'
    },
    imageContainer: {
        position: 'relative',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconContainer: {
        backgroundColor: colors.PrimaryBlue,
        position: 'absolute',
        top: 100,
        left: 210
    },
});

