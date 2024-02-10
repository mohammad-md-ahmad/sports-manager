import React, { useState } from "react";

import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    VirtualizedList,
} from "react-native";
import globalStyles from "../../styles/styles";
import NotificationService from "../../api/NotificationService";
import { useFocusEffect } from "@react-navigation/native";
import BookingCard from "../booking/bookingCard";
import NotificationCard from "./notificationCard";

export default function Notifications(): React.JSX.Element {

    const [notifications, setNotifications] = useState([]);

    let notificationService = new NotificationService();

    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.

            loadData();
        }, [])
    );

    const loadData = () => {
        notificationService.getUserNotifications().then((response) => {
            setNotifications(response?.data?.data?.data);
        }).catch((error) => {
        });
    }

    const getItem = (_data: unknown, index: number) => notifications[index] ?? 0;
    const getItemCount = (_data: unknown) => notifications?.length ?? 0;

    return (
        <SafeAreaView style={styles.container}>
            <VirtualizedList
                initialNumToRender={6}
                renderItem={({ item }) => <NotificationCard notification={item} loadData={loadData} />}
                keyExtractor={item => item.uuid}
                getItemCount={getItemCount}
                getItem={getItem}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 0,
    },
});
