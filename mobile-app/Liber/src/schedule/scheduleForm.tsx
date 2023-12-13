import React, { useState } from "react";

import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import globalStyles, { placeHolderTextColor } from "../../styles/styles";
import colors from "../../styles/colors";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Button } from "react-native-elements";
import ScheduleService from "../../api/ScheduleService";
import { useNavigation } from "@react-navigation/native";
import ErrorView from "../common/errorView";
import { Screens } from "../../helpers/constants";

interface ScheduleFormData {
    time_from: string;
    time_to: string;
    date_from: string;
    date_to: string;
    slot: string;
}

function ScheduleForm({ route }): React.JSX.Element {
    const { facility } = route.params;

    let scheduleService = new ScheduleService();

    const navigator = useNavigation();

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const [formData, setFormData] = useState<ScheduleFormData>({
        time_from: '',
        time_to: '',
        date_from: '',
        date_to: '',
        slot: ''
    });

    const [currentInput, setCurrentInput] = useState('');

    const showDatePicker = (state: string) => {
        setDatePickerVisibility(true);
        setCurrentInput(state);
    };

    const showTimePicker = (state: string) => {
        setTimePickerVisibility(true);
        setCurrentInput(state);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleDateConfirm = (date) => {
        setFormData((prevData) => ({
            ...prevData,
            [currentInput]: date.toDateString(),
        }));
        hideDatePicker();
    };


    const handleTimeConfirm = (time) => {
        const options = { hour: 'numeric', minute: 'numeric' };
        setFormData((prevData) => ({
            ...prevData,
            [currentInput]: time.toLocaleTimeString(undefined, options),
        }));
        hideTimePicker();
    };

    const [errors, setErrors] = useState(null);

    const onSubmitPress = () => {
        // Handle the form submission with the selected date (formDate)

        formData['facility_uuid'] = facility.uuid;

        scheduleService.createBatch(formData).then((response) => {
            // Handle a successful API response
            navigator.navigate(Screens.FacilityView, { 'facility': facility });
        })
            .catch((error) => {
                // Handle API request errors here
                setErrors(error.response.data.errors)
            });
    };

    const handleInputChange = (key: string, value: any) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    }

    const handleCancel = () => {
        navigator.navigate(Screens.FacilityView, { 'facility': facility });
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.formContainer}>
                <View style={styles.formView}>

                    {errors != null ? <ErrorView errorData={errors} /> : <></>}

                    <View>
                        <TextInput
                            placeholder="Start Date"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.date_from}
                            //onChangeText={(text) => handleInputChange('date_from', text)}
                            onPressIn={() => showDatePicker('date_from')}
                        />
                    </View>

                    <View>
                        <TextInput
                            placeholder="Start Time"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.time_from}
                            //onChangeText={(text) => handleInputChange('time_from', text)}
                            onPressIn={() => showTimePicker('time_from')}
                        />
                    </View>


                    <View>
                        <TextInput
                            placeholder="End Date"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.date_to}
                            //onChangeText={(text) => handleInputChange('date_to', text)}
                            onPressIn={() => showDatePicker('date_to')}
                        />
                    </View>

                    <View>
                        <TextInput
                            placeholder="End Time"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.time_to}
                            //onChangeText={(text) => handleInputChange('time_to', text)}
                            onPressIn={() => showTimePicker('time_to')}
                        />
                    </View>


                    <View>
                        <TextInput
                            placeholder="Slot (in minutes) ex: 90"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.slot}
                            keyboardType="numeric"
                            onChangeText={(text) => handleInputChange('slot', text)}
                        />
                    </View>

                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleDateConfirm}
                        onCancel={hideDatePicker}
                    />

                    <DateTimePickerModal
                        isVisible={isTimePickerVisible}
                        mode="time"
                        onConfirm={handleTimeConfirm}
                        onCancel={hideTimePicker}
                    />

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
        padding: 16,
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
        shadowColor: 'green',
        overlayColor: 'blue',
        backgroundColor: 'transparent',
        padding: 10,
        marginTop: 0,
        width: '100%',
    },
    submitButton: {
        ...globalStyles.button,
        padding: 10,
        width: '100%',
        marginTop: 0,
    },
});

export default ScheduleForm;
