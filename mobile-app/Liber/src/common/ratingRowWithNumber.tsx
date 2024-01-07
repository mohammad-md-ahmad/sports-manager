import { StyleSheet, Text, View } from 'react-native';
import colors from '../../styles/colors';
import RatingControl from './ratingControl';

interface RatingData {
    ratingNumber: number,
}

interface RatingDataProps {
    ratingData: RatingData;
}

const RatingRowWithNumber: React.FC<RatingDataProps> = ({ ratingData }) => {
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
    },
    ratingText: {
        fontSize: 16,
        color: colors.PrimaryBlue,
        marginEnd: 5,
    },
});

export default RatingRowWithNumber;
