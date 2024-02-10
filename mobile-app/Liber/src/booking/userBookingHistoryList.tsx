import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    Text,
    VirtualizedList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import BookingService from "../../api/BookingService";
import { getCompanyData } from "../../helpers/companyDataManage";
import { getUserData } from "../../helpers/userDataManage";
import { UserType } from "../../helpers/constants";
import BookingCard from "./bookingCard";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import globalStyles from "../../styles/styles";
import colors from "../../styles/colors";

export default function UserBookingHistoryList(): React.JSX.Element {
    const bookingService = new BookingService();

    const userData = useSelector(state => state.userData);
    const [bookingHistory, setBookingHistory] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            if (userData) {
                getBookingHistoryList();
            }
        }, [userData])
    );


    function getBookingHistoryList() {
        let filter = {
            company_uuid: null,
            user_uuid: null,
        };

        filter.user_uuid = userData?.uuid;

        bookingService.list(filter).then((response) => {
            setBookingHistory(response.data?.data?.data);
        }).catch((error) => {
        });
    }

    const getItem = (_data: unknown, index: number) => bookingHistory[index] ?? 0;
    const getItemCount = (_data: unknown) => bookingHistory?.length ?? 0;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>{userData?.first_name + ' ' + userData?.last_name}</Text>
            <VirtualizedList
                initialNumToRender={6}
                renderItem={({ item }) => <BookingCard booking={item} user_uuid={userData?.uuid} callback={getBookingHistoryList} />}
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
    text: {
        ...globalStyles.text,
        fontSize: 20,
        color: colors.PrimaryBlue,
        margin: 10,
    }
});
