import { useEffect, useState } from 'react';
import StarRating from 'react-native-star-rating';
import colors from '../../styles/colors';

interface RatingData {
    ratingNumber: number,
    disabled: boolean,
}

interface RatingDataProps {
    ratingData: RatingData;
}

const RatingControl: React.FC<RatingDataProps> = ({ ratingData }) => {
    const [rating, setRating] = useState(ratingData?.ratingNumber ?? 0);

    useEffect(() => {
        if (ratingData?.ratingNumber) {
            setRating(ratingData?.ratingNumber);
        }
    }, [ratingData]);

    const onStarRatingPress = (ratingNumber) => {
        setRating(ratingNumber);
    }

    return (
        <StarRating
            disabled={ratingData?.disabled ?? true}
            maxStars={5}
            rating={rating}
            selectedStar={(ratingNumber) => onStarRatingPress(ratingNumber)}
            starSize={20}
            fullStarColor={colors.Orange}
            emptyStarColor={colors.Orange}
        />
    );
}

export default RatingControl;
