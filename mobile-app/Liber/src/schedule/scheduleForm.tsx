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

interface ScheduleFormData {
    start_time: string;
    end_time: string;
    start_date: string;
    end_date: string;
    slot: string;
}

function ScheduleForm({ route }): React.JSX.Element {
    const { facility } = route.params;

    let scheduleService = new ScheduleService();
    const navigator = useNavigation();


    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const [formData, setFormData] = useState<ScheduleFormData>({
        start_time: '',
        end_time: '',
        start_date: '',
        end_date: '',
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

        console.log(formData);

        scheduleService.create(formData).then((response) => {
            // Handle a successful API response
            navigator.navigate(Screens.facilityView);
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


    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.formContainer}>
                <View style={styles.formView}>

                    {errors != null ? <ErrorView errorData={errors} /> : <></>}

                    <View>
                        <Text style={styles.label}>Start Date</Text>
                        <TextInput
                            placeholder="Start Date"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.start_date}
                            //onChangeText={(text) => handleInputChange('start_date', text)}
                            onPressIn={() => showDatePicker('start_date')}
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>Start Time</Text>
                        <TextInput
                            placeholder="Start Time"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.start_time}
                            //onChangeText={(text) => handleInputChange('start_time', text)}
                            onPressIn={() => showTimePicker('start_time')}
                        />
                    </View>


                    <View>
                        <Text style={styles.label}>End Date</Text>
                        <TextInput
                            placeholder="End Date"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.end_date}
                            //onChangeText={(text) => handleInputChange('end_date', text)}
                            onPressIn={() => showDatePicker('end_date')}
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>End Time</Text>
                        <TextInput
                            placeholder="End Time"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.end_time}
                            //onChangeText={(text) => handleInputChange('end_time', text)}
                            onPressIn={() => showTimePicker('end_time')}
                        />
                    </View>


                    <View>
                        <Text style={styles.label}>Slot (in minutes)</Text>
                        <TextInput
                            placeholder="90"
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

                    <Button
                        onPress={() => onSubmitPress()}
                        title="Submit"
                        buttonStyle={styles.button}
                    />
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

});

export default ScheduleForm;
