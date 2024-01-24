import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import globalStyles from '../../styles/styles';
import { useNavigation } from '@react-navigation/native';
import { Screens } from '../../helpers/constants';


interface Survey {
    uuid: string;
    name: string;
    is_active: boolean;
}


interface SurveyCardProps {
    survey: Survey;
}

const SurveyCard: React.FC<SurveyCardProps> = ({ survey }) => {
    const navigation = useNavigation();
    const handleSurveyClick = () => {
        navigation.navigate(Screens.SurveyForm, { 'survey': survey });
    }

    return (
        <TouchableOpacity onPress={handleSurveyClick} activeOpacity={0.8}>
            <Card containerStyle={styles.cardView}>
                <View style={styles.container}>

                    <View style={styles.surveyInfo}>
                        <View style={styles.row}>
                            {/* <Text style={styles.label}>Name:</Text> */}
                            <Text style={styles.value}>{survey?.name}</Text>
                            <Text style={styles.rightValue}>{survey?.is_active ? "Active" : ""}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.value}>Created On</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.value}>Answers Count</Text>
                        </View>

                    </View>

                </View>

            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardView: {
        borderRadius: 10,
        borderColor: colors.PrimaryGreenLight,
        borderWidth: 0.5,
        marginHorizontal: 15,
        marginTop: 7,
        marginBottom: 7
    },
    container: {
        flexDirection: 'row',
        //height: 100,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginRight: 20,
    },
    surveyInfo: {
        flex: 1, // Takes up the remaining space
        flexDirection: 'column',
    },
    label: {
        ...globalStyles.text,
        fontSize: 18,
        color: colors.PrimaryBlue,
        width: 70,
        paddingHorizontal: 0,
    },
    value: {
        ...globalStyles.text,
        fontSize: 16,
        color: colors.PrimaryBlue,
        fontFamily: fonts.Poppins.regular,
        paddingHorizontal: 0,
        textAlign: 'left',
    },
    rightValue: {
        ...globalStyles.text,
        fontSize: 14,
        color: colors.PrimaryBlue,
        fontFamily: fonts.Poppins.regular,
        paddingHorizontal: 0,
        textAlign: 'right',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Distribute space between children
        alignItems: 'center', // Center children vertically
    },
    historyButton: {
        ...globalStyles.button,
        width: 80,
        marginHorizontal: 5,
    },
    viewButton: {
        ...globalStyles.button,
        width: 80,
        marginHorizontal: 5,
        backgroundColor: colors.Orange,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center', // Adjust this to control the spacing between buttons
        alignItems: 'center',
        marginTop: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    switchLabel: {
        ...globalStyles.text,
        fontSize: 18,
        fontFamily: fonts.Poppins.regular,
        color: colors.PrimaryBlue
    }
});

export default SurveyCard;
