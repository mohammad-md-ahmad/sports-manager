import { StyleSheet, Text, View } from 'react-native';
import colors from '../../styles/colors';
import RatingControl from './ratingControl';
import { useEffect } from 'react';

interface RatingData {
    ratingNumber: number,
}

interface RatingDataProps {
    ratingData: RatingData;
}

const RatingRowWithNumber: React.FC<RatingDataProps> = ({ ratingData }) => {
    useEffect(() => {
        console.log('RATING NUMBER hhh', ratingData.ratingNumber);
    }, []);

    return (
        <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>{ratingData.ratingNumber}</Text>
            <RatingControl ratingData={ratingData} />
        </View>
    );
}

const styles = StyleSheet.create({
    ratingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    ratingText: {
        fontSize: 16,
        color: colors.PrimaryBlue,
        marginEnd: 5,
    },
});

export default RatingRowWithNumber;
