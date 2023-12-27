import React, { useEffect, useState } from "react";

import {
    ScrollView,
    StyleSheet,
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
    schedule_uuid: string;
    date_time_from: string;
    date_time_to: string;
}

function ScheduleEditForm({ route }): React.JSX.Element {
    const { schedule } = route.params;

    let scheduleService = new ScheduleService();

    const navigator = useNavigation();

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [formData, setFormData] = useState<ScheduleFormData>({
        schedule_uuid: '',
        date_time_from: '',
        date_time_to: '',
    });

    const [currentInput, setCurrentInput] = useState('');

    const showDatePicker = (state: string) => {
        setDatePickerVisibility(true);
        setCurrentInput(state);
    };

    useEffect(() => {
        setFormData(schedule);
    }, [])

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const fotmatDate = (date) => {
        const originalDate = new Date(date);

        const year = originalDate.getFullYear();
        const month = String(originalDate.getMonth() + 1).padStart(2, "0");
        const day = String(originalDate.getDate()).padStart(2, "0");
        const hours = String(originalDate.getHours()).padStart(2, "0");
        const minutes = String(originalDate.getMinutes()).padStart(2, "0");
        const seconds = String(originalDate.getSeconds()).padStart(2, "0");

        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        return formattedDate;
    }

    const handleDateConfirm = (date) => {
        setFormData((prevData) => ({
            ...prevData,
            [currentInput]: fotmatDate(date),
        }));
        hideDatePicker();
    };

    const [errors, setErrors] = useState(null);

    const onSubmitPress = () => {
        // Handle the form submission with the selected date (formDate)

        formData['schedule_uuid'] = schedule.uuid;

        scheduleService.updateScheduleDetails(formData).then((response) => {
            // Handle a successful API response
            navigator.navigate(Screens.Calendar);
        }).catch((error) => {
            // Handle API request errors here
            setErrors(error.response.data.errors)
        });
    };

    const handleCancel = () => {
        navigator.navigate(Screens.Calendar);
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
                            value={formData.date_time_from}
                            onPressIn={() => showDatePicker('date_time_from')}
                        />
                    </View>

                    <View>
                        <TextInput
                            placeholder="End Date"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.date_time_to}
                            onPressIn={() => showDatePicker('date_time_to')}
                        />
                    </View>

                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="datetime"
                        onConfirm={handleDateConfirm}
                        onCancel={hideDatePicker}
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

export default ScheduleEditForm;
