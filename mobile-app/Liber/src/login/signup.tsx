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
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface UserFormData {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    type: string;
    password: string;
    password_confirmation: string;
    pushSubscriptionId: string;
    gender_uuid: string;
    dob: string;
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
        dob: '',
        gender_uuid: ''
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
                    setErrors(error.response.data.errors)
                    // Handle API request errors here
                });
        }
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

    const [genders, setGenders] = useState([]);
    const [selectedGender, setSelectedGender] = useState<string>('');

    const handleGenderDropdownChange = (callback) => {
        setSelectedGender(callback(selectedGender));

        setFormData({
            ...formData,

        });
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

                    {!formData.is_company &&
                        <>
                            <View>
                                <TextInput
                                    placeholder="End Date"
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

                        </>
                    }

                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleDateConfirm}
                        onCancel={hideDatePicker}
                    />

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
    },
    dropDown: {
        ...globalStyles.inputText,
        marginBottom: 10,
    },
});

