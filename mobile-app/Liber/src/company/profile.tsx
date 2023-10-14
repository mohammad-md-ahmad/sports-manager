import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

function Profile() {
    // Extract user information from the route parameters

    let companyData = {
        name: 'Liber Co',
        description: 'Liber Co is a company for booking facilities Liber Co is a company for booking facilities Liber Co is a company for booking facilities',
        logo: require('./../../assets/images/liber_logo.png')
    }

    return (
        <View style={styles.container}>
            <Image source={companyData.logo} style={styles.logo} />

            <Text style={styles.name}>{companyData.name}</Text>
            <Text style={styles.description}>{companyData.description}</Text>

            {/* Add more fields as needed */}
        </View>
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
        resizeMode: 'contain',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'gray',
    },
    description: {
        padding:10,
        fontSize: 16,
        color: 'gray',
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
});

export default Profile;
