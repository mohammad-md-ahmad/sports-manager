import React, { useEffect, useState } from "react";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ScrollView, TextInput, StyleSheet, View, Text } from "react-native";
import globalStyles from "../../styles/styles";
import colors from "../../styles/colors";
import { Button } from "react-native-elements";
import { Screens, UserType } from "../../helpers/constants";
import CompanySurveyService from "../../api/CompanySurveyService";
import { useSelector } from "react-redux";
import fonts from "../../styles/fonts";
import SurveyConfirmation from "../common/surveyConfirmation";

export default function SurveyFillForm({ route }): React.JSX.Element {
    const { surveyUuid } = route?.params ?? null;

    const [survey, setSurvey] = useState(null);
    const user = useSelector(state => state.authUserData);

    const navigator = useNavigation();
    const companySurveyService = new CompanySurveyService();

    const [textInputValues, setTextInputValues] = useState([]); // Initial array of empty strings

    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.
            if (surveyUuid)
                companySurveyService.getSurvey({ uuid: surveyUuid })
                    .then((response) => {
                        setSurvey(response.data?.data);
                    }).catch((error) => {
                    });
        }, [surveyUuid])
    );


    useEffect(() => {
        if (survey) {
            console.log('survey', survey)
            survey?.questions.map((value, index) => {
                value['company_survey_question_id'] = value['uuid'];
                value['answer'] = '';

                return value;
            });
            setTextInputValues(survey?.questions);
        }
    }, [survey])


    const handleCancel = () => {
        if (user.type == UserType.CompanyUser) {
            navigator.navigate(Screens.SurviesList);
        }
        else {
            navigator.navigate(Screens.UserProfile);
        }
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

    const handleSubmit = () => {
        let sanitizedFormData = survey;
        sanitizedFormData.user_id = user?.uuid;
        sanitizedFormData['answers'] = textInputValues;

        console.log(sanitizedFormData);
        companySurveyService.userResponse(sanitizedFormData).then((response) => {
            setIsConfrimationVisible(true);
        }).catch((error) => {
            console.log()
        });

    };

    const handleInputChange = (index, text) => {
        const newValues = [...textInputValues];
        newValues[index].answer = text

        setTextInputValues(newValues);
    };

    const [isConfrimationVisible, setIsConfrimationVisible] = useState(false);
    const confirmSurvey = () => {
        setIsConfrimationVisible(false);
        if (user.type == UserType.CompanyUser) {
            navigator.navigate(Screens.SurviesList);
        }
        else {
            navigator.navigate(Screens.UserProfile);
        }
    }

    const renderTextInputArray = () => {
        return textInputValues.map((value, index) => (
            <>
                <View>
                    <Text style={styles.label}>{value.question + '?'}</Text>
                    <TextInput
                        key={index}
                        value={value.answer}
                        placeholder={`Question ${index + 1}`}
                        onChangeText={(text) => handleInputChange(index, text)}
                        style={styles.input}
                    />
                </View>
            </>
        ));
    };


    return (
        <ScrollView >
            <View style={styles.container}>
                {/* Facility Details Section */}
                <View>
                    <Text style={styles.title}>{survey?.name}</Text>
                </View>
                <>
                    {renderTextInputArray()}
                </>
                <View style={styles.buttonContainer}>
                    <View style={styles.buttonWrapper}>
                        <Button onPress={handleCancel} title="Cancel" titleStyle={{ color: 'red' }} buttonStyle={styles.cancelButton} />
                    </View>
                    <View style={styles.buttonWrapper}>
                        <Button onPress={handleSubmit} title="Submit" buttonStyle={styles.submitButton} />
                    </View>
                </View>
            </View>
            <SurveyConfirmation isVisible={isConfrimationVisible} onConfirm={confirmSurvey}></SurveyConfirmation>
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
    title: {
        ...globalStyles.inputTextLabel,
        fontSize: 18,
        color: colors.PrimaryBlue,
        fontFamily: fonts.Poppins.bold
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
