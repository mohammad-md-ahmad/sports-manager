import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import globalStyles from '../../styles/styles';


interface Survey {
    uuid: string;
    full_name: string;
    email: string;
    profile_picture: string;
}


interface SurveyCardProps {
    survey: Survey;
}

const SurveyCard: React.FC<SurveyCardProps> = ({ survey }) => {
    return (
        <Card containerStyle={styles.cardView}>
            <View style={styles.container}>

                <View style={styles.userInfo}>
                    <View style={styles.row}>
                        {/* <Text style={styles.label}>Name:</Text> */}
                        <Text style={styles.value}>{survey?.name}</Text>
                    </View>
                    <View style={styles.row}>
                        {/* <Text style={styles.label}>Email:</Text> */}
                        {/* <Text style={styles.value}>{currentUser?.email}</Text> */}
                    </View>

                </View>

            </View>

        </Card>
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
    userInfo: {
        flex: 1, // Takes up the remaining space
        flexDirection: 'column',
        marginTop: 15,
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
        fontSize: 18,
        color: colors.PrimaryBlue,
        fontFamily: fonts.Poppins.regular,
        paddingHorizontal: 0,
    },
    row: {
        flexDirection: 'row',
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
