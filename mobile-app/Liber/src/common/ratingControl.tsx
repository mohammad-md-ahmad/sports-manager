import { useState } from 'react';
import { StyleSheet } from 'react-native';
import StarRating from 'react-native-star-rating';
import colors from '../../styles/colors';

function RatingControl(props): React.JSX.Element {
    const [rating, setRating] = useState(props?.rating ?? 0);

    const onStarRatingPress = (rating) => {
        setRating(rating);
    }

    return (
        <StarRating
            disabled={props?.disabled ?? false}
            maxStars={5}
            rating={rating}
            selectedStar={(rating) => onStarRatingPress(rating)}
            starSize={20}
            starStyle={
                styles.star
            }
        />
    );
}

const styles = StyleSheet.create({
    star: {
        color: colors.Orange
    }
});

export default RatingControl;
