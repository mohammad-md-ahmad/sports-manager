import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    VirtualizedList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import BookingService from "../../api/BookingService";
import { getCompanyData } from "../../helpers/companyDataManage";
import { getUserData } from "../../helpers/userDataManage";
import { UserType } from "../../helpers/constants";
import BookingCard from "./bookingCard";
import { StyleSheet } from "react-native";

export default function BookingHistoryList(): React.JSX.Element {
    const bookingService = new BookingService();

    const [userData, setUserData] = useState({});
    const [companyData, setCompanyData] = useState({});
    const [bookingHistory, setBookingHistory] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            if (!userData || !companyData) {
                getBookingHistoryList();
            }
        }, [userData, companyData])
    );

    useEffect(() => {
        getUserData().then((data: string | null) => {
            setUserData(data === null ? null : JSON.parse(data));
        });

        getCompanyData().then((data: string | null) => {
            setCompanyData(data === null ? null : JSON.parse(data));
        });
    }, []);

    function getBookingHistoryList() {
        let filter = {
            company_uuid: null,
            user_uuid: null,
        };

        if (userData?.type == UserType.CompanyUser) {
            filter.company_uuid = companyData?.uuid;
        } else if (userData?.type == UserType.CustomerUser) {
            filter.user_uuid = userData?.uuid;
        }

        bookingService.list(filter).then((response) => {
            setBookingHistory(response.data?.data?.data);
        }).catch((error) => {
        });
    }

    const getItem = (_data: unknown, index: number) => bookingHistory[index] ?? 0;
    const getItemCount = (_data: unknown) => bookingHistory?.length ?? 0;

    return (
        <SafeAreaView style={styles.container}>
            <VirtualizedList
                initialNumToRender={6}
                renderItem={({ item }) => <BookingCard booking={item} user_uuid={userData?.uuid} callback={getBookingHistoryList}/>}
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
