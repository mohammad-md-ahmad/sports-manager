import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button, Card, ListItem } from 'react-native-elements';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import globalStyles from '../../styles/styles';
import { Switch } from 'react-native-gesture-handler';
import CompanyCustomersService from '../../api/CompanyCustomersService';

interface User {
    name: string;
    email: string;
    imageUri: string;
    isAutoApprove: boolean;
}

interface UserCardProps {
    user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {

    const [currentUser, setCurrentUser] = useState(user);

    const companyCustomersService = new CompanyCustomersService();

    const handleInputChange = (key: string, value: any) => {
        setCurrentUser((prevData) => ({
            ...prevData,
            [key]: value,
        }));

        companyCustomersService.toggleAutoApprove(currentUser)
            .then((response) => {

            }).catch((error) => {
            });
    }

    return (
        <Card containerStyle={styles.cardView}>
            <View style={styles.container}>
                <Image
                    source={currentUser.imageUri ? { uri: currentUser.imageUri } : require('./../../assets/images/liber_logo.png')}
                    style={styles.image}
                />
                <View style={styles.userInfo}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.value}>{currentUser?.full_name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>{currentUser?.email}</Text>
                    </View>

                </View>

            </View>
            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Auto Approve</Text>
                <Switch
                    value={currentUser?.isAutoApprove}
                    onValueChange={() => { handleInputChange('isAutoApprove', !currentUser?.isAutoApprove) }}
                    trackColor={{ false: colors.PrimaryBlueLight, true: colors.PrimaryBlueLight }}
                    thumbColor={currentUser?.isAutoApprove ? colors.PrimaryBlue : colors.OffWhite}
                />
            </View>
            <View>
                <View style={styles.buttonRow}>
                    <Button
                        onPress={() => { }}
                        title="Hisotry"
                        buttonStyle={styles.historyButton}
                    />
                    <Button
                        onPress={() => { }}
                        title="View"
                        buttonStyle={styles.viewButton}
                    />

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

export default UserCard;
