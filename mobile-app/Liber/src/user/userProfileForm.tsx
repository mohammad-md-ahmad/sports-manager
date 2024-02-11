import React, { useEffect, useState } from "react";

import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
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
import { GlobaSateKey, Screens } from "../../helpers/constants";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import ErrorView from "../common/errorView";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface UserFormData {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    dob: string;
    gender: string;
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
        dob: '',
        gender: ''
    });

    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.

            userService.getUser().then((response) => {
                setFormData({ ...response.data.data, profile_picture: null });
                setSelectedGender(response.data.data.gender);
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

    const [errors, setErrors] = useState(null);
    const dispatch = useDispatch();

    function onSubmitPress(): void {
        userService.update(formData).then((response) => {
            // Handle a successful API response
            dispatch({ type: GlobaSateKey.SetAuthUserData, payload: { ...response.data.data, profile_picture: { uri: response.data?.data?.profile_picture } } });
            navigator.navigate(Screens.UserProfile);
        })
            .catch((error) => {
                // Handle API request errors here
                setErrors(error.response.data.errors)
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

    const handleCancel = () => {
        navigator.navigate(Screens.UserProfile);
    };

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const handleDateConfirm = (date) => {
        setFormData((prevData) => ({
            ...prevData,
            [currentInput]: formatDate(date),
        }));
        hideDatePicker();
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const formatDate = (date) => {
        const originalDate = new Date(date);

        const year = originalDate.getFullYear();
        const month = String(originalDate.getMonth() + 1).padStart(2, "0");
        const day = String(originalDate.getDate()).padStart(2, "0");

        const formatedDate = `${year}-${month}-${day}`;

        return formatedDate;
    }

    const [currentInput, setCurrentInput] = useState('');
    const showDatePicker = (state: string) => {
        setDatePickerVisibility(true);
        setCurrentInput(state);
    };

    const gendersState = useSelector(state => state.userGenders);
    const [genders, setGenders] = useState([]);

    useEffect(() => {
        if (gendersState) {
            let data = [];
            Object.keys(gendersState).forEach(function (key) {
                data.push({
                    label: gendersState[key],
                    value: key,
                });
            });
            setGenders(data);
        }

    }, [gendersState])

    const [selectedGender, setSelectedGender] = useState<string>('');

    const handleGenderDropdownChange = (callback) => {
        setSelectedGender(callback(selectedGender));

        setFormData({
            ...formData,
            gender: callback(formData.gender),
        });
    };

    const [openDropdown, setOpenDropdown] = useState(null);

    const handleOpen = (dropdownId) => {
        // Close any open dropdowns
        setOpenDropdown(dropdownId);
    };

    const handleClose = () => {
        // Close the currently open dropdown
        setOpenDropdown(null);
    };

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
                                    placeholder="Date of birth"
                                    placeholderTextColor={placeHolderTextColor}
                                    style={styles.formTextInput}
                                    value={formData.dob}
                                    onPressIn={() => showDatePicker('dob')}
                                />
                            </View>

                            < View >
                                <DropDownPicker
                                    textStyle={{ color: colors.PrimaryBlue }}
                                    placeholder="Select Gender"
                                    placeholderStyle={{ color: colors.PrimaryBlue }}
                                    open={openDropdown == "selectedGender"}
                                    value={selectedGender}
                                    items={genders}
                                    onPress={() => handleOpen("selectedGender")}
                                    onClose={handleClose}
                                    setValue={(callback) => handleGenderDropdownChange(callback)}
                                    style={styles.dropDown}
                                />
                            </View>

                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleDateConfirm}
                                onCancel={hideDatePicker}
                            />

                            {/* <Button
                                onPress={() => onSubmitPress()}
                                title="Submit"
                                buttonStyle={styles.button}
                            /> */}


                            <View style={styles.buttonContainer}>
                                <View style={styles.buttonWrapper}>
                                    <Button onPress={() => handleCancel()} title="Cancel" titleStyle={{ color: 'red' }} buttonStyle={styles.cancelButton} />
                                </View>
                                <View style={styles.buttonWrapper}>
                                    <Button onPress={() => onSubmitPress()} title="Submit" buttonStyle={styles.submitButton} />
                                </View>
                            </View>
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    buttonWrapper: {
        width: '48%',
    },
    cancelButton: {
        ...globalStyles.button,
        color: 'red',
        backgroundColor: 'transparent',
        padding: 10,
        width: '100%',
        marginTop: 0,
    },
    submitButton: {
        ...globalStyles.button,
        padding: 10,
        width: '100%',
        marginTop: 0,
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
    dropDown: {
        ...globalStyles.inputText,
        marginBottom: 10,
    },
});

