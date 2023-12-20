import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RatingControl from '../common/ratingControl';

interface Rating {
    commenter_name: string;
    rating: string;
    comment: string;
}

interface RatingItemProps {
    rating: Rating;
}

const RatingItem: React.FC<RatingItemProps> = ({ rating }) => {
    return (
        <View style={styles.cardContainer}>
            <View style={styles.commenterRow}>
                <Text style={styles.commenterName}>{rating.commenter_name}</Text>
                <RatingControl ratingData={{ratingNumber: rating?.rating}} />
            </View>
            <Text style={styles.commentText}>{rating.comment}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginTop: 7,
        marginBottom: 7,
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: 10,
    },
    commenterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    commenterName: {
        width: '48%', // 50% width with a little space for margin
    },
    commentText: {

    },
});

export default RatingItem;
