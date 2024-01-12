import React from 'react';
import { View, Text, StyleSheet, Card } from 'react-native';

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

    return (
        <View style={styles.cardContainer}>
            <Card style={styles.card}>
                <View style={[styles.statusLine, { backgroundColor: statusColor }]} />
                <View>
                    <Text style={styles.text}>UUID: {notification.uuid}</Text>
                    <Text style={styles.text}>User ID: {notification.user_id}</Text>
                    <Text style={styles.text}>Title: {notification.title}</Text>
                    <Text style={styles.text}>Notification: {notification.notification}</Text>
                    <Text style={styles.text}>Status: {notification.status}</Text>
                    <Text style={styles.text}>Category: {notification.category}</Text>
                </View>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        margin: 10,
    },
    card: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 16,
        marginBottom: 8,
    },
    statusLine: {
        width: 2,
        height: 'auto',
        marginRight: 16,
    },
});

export default NotificationCard;
