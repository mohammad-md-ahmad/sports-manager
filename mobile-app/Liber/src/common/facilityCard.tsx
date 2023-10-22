import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import colors from '../../styles/colors';

interface Facility {
    name: string;
    type: string;
    details: {
        length: string;
        width: string;
    },
    gallery: [];
}

interface FacilityCardProps {
    facility: Facility;
}

const FacilityCard: React.FC<FacilityCardProps> = ({ facility }) => {
    console.log({uri: facility.gallery[0].url });
    return (
        <Card style={styles.cardView}>
            <View style={styles.container}>
                <Image
                    source={facility.gallery?.[0]?.url ? {uri: facility.gallery[0].url } : require('./../../assets/images/liber_logo.png')}
                    style={styles.image}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.name}>Name: {facility.name}</Text>
                    <Text style={styles.subName}>Type: {facility.type}</Text>
                    <Text style={styles.subName}>Length: {facility.details.length}</Text>
                    <Text style={styles.subName}>Width: {facility.details.width}</Text>
                </View>

            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    cardView: {
        borderRadius: 30,
        borderBlockColor: colors.PrimaryBlue,
        borderWidth: 2
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
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.PrimaryBlue
    }, subName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.PrimaryBlue
    },
});

export default FacilityCard;
