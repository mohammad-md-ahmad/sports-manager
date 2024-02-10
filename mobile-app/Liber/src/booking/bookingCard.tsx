import React, { useState } from 'react';
import { View, Image, StyleSheet, TextInput } from 'react-native';
import { Button, Icon, Text } from 'react-native-elements';
import colors from '../../styles/colors';
import globalStyles from '../../styles/styles';
import RatingControl from '../common/ratingControl';
import RatingService from '../../api/RatingService';
import { EntityType, UserType } from '../../helpers/constants';
import { useSelector } from 'react-redux';

interface Booking {
    uuid: string;
    status: string;
    date: string;
    is_ratable: boolean;
    company: {
        uuid: string;
        name: string;
        logo: string;
    };
}

interface BookingCardProps {
    booking: Booking;
    user_uuid: string;
    callback: any;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, user_uuid, callback }) => {
    const ratingService = new RatingService();

    const [showRatingInput, setShowRatingInput] = useState(false);
    const [ratingData, setRatingData] = useState({
        rated_entity_type: EntityType.Company,
        rated_entity_uuid: booking.company.uuid,
        user_uuid: user_uuid,
        booking_uuid: booking.uuid,
        rating: 0,
        comment: '',
    });

    let statusColor = determineStatusBarColor(booking.status);

    // Determine the background color based on the booking status
    function determineStatusBarColor(status: string) {
        let statusColor;

        switch (booking.status) {
            case 'Pending':
                statusColor = 'orange';
                break;
            case 'Approved':
                statusColor = 'green';
                break;
            case 'Declined':
                statusColor = 'red';
                break;
            default:
                statusColor = 'black';
                break;
        }

        return statusColor;
    }

    function setRatingValue(value: number) {
        setRatingData({
            ...ratingData,
            rating: value
        });
    }

    function onShowRateBtnPress(status: boolean) {
        setShowRatingInput(status);

        if (!status) {
            onRateInputHidden();
        }
    }

    function onRateInputHidden() {
        setRatingData({
            ...ratingData,
            comment: '',
        })
    }

    function onRateBtnPress() {
        ratingService.create(ratingData).then((response) => {
            setShowRatingInput(false);
            onRateInputHidden();
            callback();
        }).catch((error) => {
        });
    }

    const user = useSelector(state => state.currentUserData);

    return (
        <View style={styles.cardContainer}>
            <View style={[styles.statusLine, { backgroundColor: statusColor }]} />
            {showRatingInput ? (
                <View style={styles.ratingInputContainerFull}>
                    <View>
                        <RatingControl ratingData={{ ratingNumber: 0, disabled: false }} callback={setRatingValue} />
                    </View>

                    <TextInput
                        placeholder="Enter your comment..."
                        style={styles.commentInput}
                        multiline={true}
                        value={ratingData.comment}
                        onChangeText={(text) => setRatingData({
                            ...ratingData,
                            comment: text
                        })}
                    />

                    <View style={styles.ratingButtonsContainer}>
                        <Button
                            onPress={onRateBtnPress}
                            title="Submit"
                            titleStyle={styles.ratingButtonText}
                            buttonStyle={styles.ratingButton}
                        />

                        <Button
                            onPress={() => onShowRateBtnPress(false)}
                            title="Cancel"
                            titleStyle={styles.ratingButtonText}
                            buttonStyle={styles.ratingButton}
                        />
                    </View>
                </View>
            ) : (
                <View style={styles.bookingInfoWrapper}>
                    <View style={styles.bookingInfoContainer}>
                        <View style={styles.contentContainer}>
                            <Image style={styles.logo} source={{ uri: booking.company.logo }} />

                            <View style={styles.companyInfo}>
                                <Text style={styles.companyName}>{booking.company.name}</Text>
                                <Text style={styles.date}>{booking.date}</Text>
                            </View>

                            <View style={styles.statusWrapper}>
                                <Text style={[styles.statusText, { color: statusColor }]}>{booking.status}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.rateItButtonContainer}>
                        {booking.is_ratable && user.type == UserType.CustomerUser ? (
                            <Button
                                onPress={() => onShowRateBtnPress(true)}
                                title="Rate It"
                                titleStyle={{ ...styles.ratingButtonText, textDecorationLine: 'none' }}
                                buttonStyle={{
                                    ...styles.rateItButton,
                                    alignSelf: 'flex-end',
                                    flex: 1,
                                }}
                                icon={<Icon name="star" type="material" size={22} color={colors.PrimaryBlue} />}
                            />
                        ) : null}
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginTop: 7,
        marginBottom: 7,
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: 10,
    },
    bookingInfoWrapper: {
        flexDirection: 'column',
        flex: 1,
    },
    bookingInfoContainer: {
        flexDirection: 'row',
    },
    statusLine: {
        width: 2,
        height: 'auto',
        marginRight: 16,
    },
    contentContainer: {
        flexDirection: 'row',
        width: 100,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    logo: {
        width: 48,
        height: 48,
        borderRadius: 100,
        marginRight: 12,
        borderWidth: 2,
        borderColor: colors.PrimaryGreenLight,
    },
    companyInfo: {
        flex: 1,
        flexGrow: 2,
        justifyContent: 'center'
    },
    companyName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: colors.Black,
    },
    date: {
        fontSize: 14,
        color: '#666',
    },
    statusWrapper: {
        flex: 1,
        flexGrow: 2,
        alignItems: 'flex-end',
    },
    statusText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    ratingInputContainerFull: {
        flex: 1,
        justifyContent: 'space-between',
    },
    rateItButtonContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        textAlign: 'right',
    },
    ratingButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    ratingButton: {
        ...globalStyles.button,
        backgroundColor: 'transparent',
        margin: 0,
        marginHorizontal: 5,
        padding: 8,
        height: 'auto',
    },
    rateItButton: {
        ...globalStyles.button,
        backgroundColor: 'transparent',
        margin: 0,
        paddingVertical: 4,
        paddingHorizontal: 16,
        height: 'auto',
        borderColor: colors.PrimaryBlue,
        borderWidth: 2,
    },
    ratingButtonText: {
        color: colors.PrimaryBlue,
        textDecorationLine: 'underline',
    },
    commentInput: {
        ...globalStyles.inputText,
        height: 75,
        marginTop: 20,
        marginBottom: 10,
    },
});

export default BookingCard;
