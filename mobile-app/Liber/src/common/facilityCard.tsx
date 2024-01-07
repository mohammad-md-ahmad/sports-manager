import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import colors from '../../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { Screens } from '../../helpers/constants';
import fonts from '../../styles/fonts';

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
    const navigation = useNavigation();
    const handleFacilityClick = () => {
        navigation.navigate(Screens.FacilityView, { 'facility': facility });
    }

    return (
        <TouchableOpacity onPress={handleFacilityClick} activeOpacity={0.8}>
            <Card containerStyle={styles.cardView}>
                <View style={styles.container}>
                    <Image
                        source={facility.gallery?.[0]?.image ? { uri: facility.gallery[0].image } : require('./../../assets/images/liber_logo.png')}
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
    userInfo: {
        flex: 1, // Takes up the remaining space
        flexDirection: 'column',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.PrimaryBlue,
        fontFamily: fonts.Poppins.bold,
    }, subName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.PrimaryBlue,
        fontFamily: fonts.Poppins.bold,
    },
});

export default FacilityCard;
