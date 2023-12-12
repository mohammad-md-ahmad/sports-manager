import React, { useMemo } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';


interface CompanyImage {
    image: string;
}

interface CompanyImageCardProps {
    companyImage: CompanyImage;
}

const CompanyImageCard: React.FC<CompanyImageCardProps> = ({ companyImage }) => {
    const randomBool = useMemo(() => Math.random() < 0.5, []);

    return (
        <View style={styles.item}>
            <Image
                source={companyImage.image ? { uri: companyImage.image } : require('./../../assets/images/liber_logo.png')}
                style={{ ...styles.image, height: randomBool ? 200 : 250, alignSelf: 'stretch' }}
            />
        </View>
    )
};
const styles = StyleSheet.create({
    item: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    image: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
        borderRadius: 15,
    },
})

export default CompanyImageCard;