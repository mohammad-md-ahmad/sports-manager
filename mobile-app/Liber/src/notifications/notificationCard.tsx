import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card } from 'react-native-elements';
import { BookingStatus, NotificationCategory } from '../../helpers/constants';
import BookingService from '../../api/BookingService';
import globalStyles from '../../styles/styles';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

interface Notification {
    uuid: string;
    user_id: string;
    title: string;
    notification: string;
    status: string;
    category: string;

}

interface NotificationCardProps {
    notification: Notification;
}


const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {

    let statusColor = determineStatusBarColor(notification.status);

    // Determine the background color based on the booking status
    function determineStatusBarColor(status: string) {
        let statusColor;

        switch (notification.status) {
            case 'Pending':
                statusColor = 'orange';
                break;
            case 'Sent':
                statusColor = 'green';
                break;
        }

        return statusColor;
    }

    const bookingService = new BookingService();
    const onApprovePress = (reservation: AgendaEntry): void => {
        bookingService.bookApprove({ uuid: reservation.uuid })
            .then((response) => {
            }).catch((error) => {
            }).finally(() => {
            })
    }

    const onDeclinePress = (reservation: AgendaEntry): void => {
        bookingService.bookDecline({ uuid: reservation.uuid })
            .then((response) => {
            }).catch((error) => {
            }).finally(() => {
            })
    }

    return (
        <View style={styles.containerView}>
            {notification.category == NotificationCategory.BookingRequest &&
                <View style={styles.card}>
                    <View style={styles.container}>
                        <View style={[styles.statusLine, { backgroundColor: statusColor }]} />
                        <View>
                            <Text style={styles.title}>{notification.title}</Text>
                            <Text style={styles.text}>{notification.notification}</Text>
                        </View>
                    </View>
                    <View style={styles.buttonRow}>
                        {notification?.booking_notification?.booking?.status == BookingStatus.Pending && <>
                            <Button
                                onPress={() => onApprovePress(notification?.booking_notification?.booking?.uuid)}
                                title="Approve"
                                buttonStyle={styles.approveButton}
                            />
                            <Button
                                onPress={() => onDeclinePress(notification?.booking_notification?.booking?.uuid)}
                                title="Reject"
                                buttonStyle={styles.rejectButton}
                            />
                        </>
                        }
                    </View>
                </View>
            }

            {notification.category == NotificationCategory.BookingResponse &&
                <View style={styles.card}>
                    <View style={styles.container}>
                        <View style={[styles.statusLine, { backgroundColor: statusColor }]} />
                        <View>
                            <Text style={styles.title}>{notification.title}</Text>
                            <Text style={styles.text}>{notification.notification}</Text>
                        </View>
                    </View>
                </View>
            }

            {notification.category == NotificationCategory.General &&
                <View style={styles.card}>
                    <View style={styles.container}>
                        <View style={[styles.statusLine, { backgroundColor: statusColor }]} />
                        <View>
                            <Text style={styles.title}>{notification.title}</Text>
                            <Text style={styles.text}>{notification.notification}</Text>
                            <Text style={styles.text}>Status: {notification.status}</Text>
                        </View>
                    </View>
                </View>
            }

        </View>
    );
};

const styles = StyleSheet.create({
    containerView: {
        marginTop: 3,
        marginBottom: 3,
    },
    container: {
        flexDirection: 'row',
        //height: 100,
    },
    card: {
        padding: 15,
        borderRadius: 10,
        borderColor: colors.PrimaryGreenLight,
        borderWidth: 0.5,
        marginHorizontal: 10,
        marginTop: 7,
        marginBottom: 7,
        backgroundColor: colors.White
    },
    title: {
        ...globalStyles.text,
        fontSize: 18,
        color: colors.PrimaryBlue,

    },
    text: {
        ...globalStyles.text,
        fontSize: 16,
        marginBottom: 8,
        fontFamily: fonts.Poppins.regular,
        color: colors.PrimaryBlue,
    },
    statusLine: {
        width: 2,
        height: 'auto',
        marginRight: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center', // Adjust this to control the spacing between buttons
        alignItems: 'center',
        marginTop: 20,
    },
    approveButton: {
        ...globalStyles.button,
        width: 80,
        marginHorizontal: 5,
    },
    rejectButton: {
        ...globalStyles.button,
        width: 80,
        marginHorizontal: 5,
        backgroundColor: colors.SecondaryRed,
    },

});

export default NotificationCard;
