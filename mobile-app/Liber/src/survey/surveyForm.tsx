import React, { useEffect, useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { Formik, useFormik } from "formik";
import { ScrollView, TextInput, StyleSheet, View, Text, TouchableOpacity, Switch } from "react-native";
import { string, array, object as yupObject } from "yup";
import globalStyles, { placeHolderTextColor } from "../../styles/styles";
import colors from "../../styles/colors";
import { Button } from "react-native-elements";
import { Screens } from "../../helpers/constants";
import CompanySurveyService from "../../api/CompanySurveyService";

interface FormData {
    name: string;
    questions: Array<string>;
    is_active: boolean;
}

export default function SurveyForm(): React.JSX.Element {
    const navigator = useNavigation();

    const companySurveyService = new CompanySurveyService();

    const formDataValidateSchema = yupObject().shape({
        name: string().required('Name is required'),
    });

    const initialFormDataValues = {
        name: '',
        questions: [],
        is_active: false
    };

    const initialTouched = {
        name: '',
        questions: [],
        is_active: false
    };

    const formik = useFormik({
        validationSchema: formDataValidateSchema,
        initialValues: initialFormDataValues,
        initialTouched: initialTouched,
        onSubmit: (values) => handleSubmit(values)
    });


    const handleCancel = () => {
        navigator.navigate(Screens.SurviesList);
    };

    const sanitizeFormData = (data) => {
        const sanitizedData = {};

        for (const key in data) {
            if (data[key] === null || data[key] === '') {
                continue; // Skip null or empty properties
            }
            if (typeof data[key] === 'object') {
                sanitizedData[key] = sanitizeFormData(data[key]); // Recursively sanitize nested objects
            } else {
                sanitizedData[key] = data[key];
            }
        }

        return sanitizedData;
    };

    const handleSubmit = (data) => {
        let sanitizedFormData = data;
        sanitizedFormData['questions'] = textInputValues;
        companySurveyService.create(sanitizedFormData).then((response) => {
            navigator.navigate(Screens.SurviesList);
        }).catch((error) => {
        });
    };

    const [isQuestionsOpen, setIsQuestionsOpen] = useState(false);

    const toggleQestions = () => {
        setIsQuestionsOpen(!isQuestionsOpen);
    };

    const [textInputValues, setTextInputValues] = useState([]); // Initial array of empty strings

    const handleInputChange = (index, text) => {
        const newValues = [...textInputValues];
        newValues[index] = text;
        setTextInputValues(newValues);
    };

    const renderTextInputArray = () => {
        return textInputValues.map((value, index) => (
            <>
                <TextInput
                    key={index}
                    value={value}
                    placeholder={`Question ${index + 1}`}
                    onChangeText={(text) => handleInputChange(index, text)}
                    style={styles.input}
                />

            </>
        ));
    };

    const handleAddInput = () => {
        setTextInputValues([...textInputValues, '']); // Add a new empty string to the array
    };

    return (
        <ScrollView >
            <View style={styles.container}>
                {/* Facility Details Section */}
                <View>
                    <TextInput
                        value={formik.values.name}
                        onChangeText={formik.handleChange('name')}
                        placeholder="Name"
                        placeholderTextColor={placeHolderTextColor}
                        style={styles.input}
                    />
                </View>
                {formik.touched.name && formik.errors.name &&
                    <Text style={{ fontSize: 14, color: 'red' }}>{formik.errors.name}</Text>
                }

                {/* Question Section */}
                <TouchableOpacity style={styles.section} onPress={toggleQestions}>
                    <Text style={styles.sectionTitle}>
                        {isQuestionsOpen ? '▼' : '▶'} Questions
                    </Text>
                </TouchableOpacity>
                {isQuestionsOpen && (
                    <>
                        {renderTextInputArray()}
                        <Button title="Add" onPress={handleAddInput} buttonStyle={styles.addButton} />
                        {/* <View>
                            <TextInput
                                value={formik.values.createAddressRequest.line_1}
                                onChangeText={formik.handleChange('createAddressRequest.line_1')}
                                placeholder="Line 1"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.input}
                            />
                        </View> */}
                        {/* {formik.touched.createAddressRequest?.line_1 && formik.errors.createAddressRequest?.line_1 &&
                            <Text style={{ fontSize: 14, color: 'red' }}>{formik.errors.createAddressRequest.line_1}</Text>
                        } */}

                    </>)}


                <View style={styles.switchContainer}>
                    <Text style={styles.label}>Is Active</Text>
                    <Switch
                        value={formik.values.is_active}
                        onValueChange={() => { formik.setFieldValue('is_active', !formik.values.is_active) }}
                        trackColor={{ false: colors.PrimaryBlueLight, true: colors.PrimaryBlueLight }}
                        thumbColor={formik.values.is_active ? colors.PrimaryBlue : colors.OffWhite}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <View style={styles.buttonWrapper}>
                        <Button onPress={handleCancel} title="Cancel" titleStyle={{ color: 'red' }} buttonStyle={styles.cancelButton} />
                    </View>
                    <View style={styles.buttonWrapper}>
                        <Button onPress={formik.handleSubmit} title="Submit" buttonStyle={styles.submitButton} />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    button: {
        ...globalStyles.button,
        flex: 1,
        width: '100%',
        padding: 0
    },
    input: {
        ...globalStyles.inputText,
    },
    dropDown: {
        ...globalStyles.inputText,
        marginBottom: 10,
    },
    label: {
        ...globalStyles.inputTextLabel
    },
    cancelButton: {
        ...globalStyles.button,
        color: 'red',
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 50,
        marginTop: 0,
        width: '100%',
    },
    submitButton: {
        ...globalStyles.button,
        padding: 10,
        marginTop: 0,
        width: '100%',
    },
    addButton: {
        ...globalStyles.button,
        padding: 10,
        marginTop: 0,
        width: '100%',
    },
    section: {
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        color: colors.PrimaryBlue,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    buttonWrapper: {
        width: '48%',
    },
    switchContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    }
});
