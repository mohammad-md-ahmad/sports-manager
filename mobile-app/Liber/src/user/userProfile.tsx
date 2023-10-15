import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import globalStyles from '../../styles/styles';
import fonts from '../../styles/fonts';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import colors from '../../styles/colors';

export default function UserProfile() {
    // Extract user information from the route parameters

    const navigator = useNavigation();

    let companyData = {
        name: 'Liber Player',
        username: 'Liber_player',
        email: 'liber_player@liber.com',
        logo: require('./../../assets/images/liber_logo.png')
    }

    function onEditPress(): void {
        navigator.navigate('UserProfileForm')
    }

    return (
        <View style={styles.container}>
            <Image source={companyData.logo} style={styles.logo} />

            <Text style={styles.name}>{companyData.name}</Text>
            <Text style={styles.username}>{companyData.username}</Text>
            <Text style={styles.email}>{companyData.email}</Text>

            <Button
                onPress={() => onEditPress()}
                title="Edit"
                buttonStyle={styles.button}
            />

            {/* Add more fields as needed */}
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
        borderWidth: 0,
        resizeMode: 'contain',
    },
    name: {
        ...globalStyles.text,
        fontSize: 20,
        color: colors.Gray,
    }, username: {
        ...globalStyles.text,
        fontFamily: fonts.Poppins.medium,
        fontSize: 18,
        color: colors.Gray,
    },
    email: {
        ...globalStyles.text,
        fontFamily: fonts.Poppins.regular,
        fontSize: 16,
        color: colors.Gray,
        marginBottom: 20,
    },
    infoContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    label: {
        width: 100,
        fontWeight: 'bold',
    },
    value: {
        flex: 1,
    },
    button: {
        ...globalStyles.button,
        width: 250,
    },
});

