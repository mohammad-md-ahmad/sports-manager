import React, { useEffect, useState } from "react";

import {
    SafeAreaView,
    StyleSheet,
    VirtualizedList,
} from "react-native";
import colors from "../../styles/colors";
import FacilityCard from "../common/facilityCard";
import FacilityService from "../../api/FacilityService";
import { getCompanyData, storeCompanyData } from "../../helpers/companyDataManage";
import MiscService from "../../api/MiscService";
import { storeFacilityTypes } from "../../helpers/facilityTypesDataManage";
import { storeCountries } from "../../helpers/CountriesDataManage";
import { getToken } from "../../helpers/tokenManage";

export default function Dashboard(): React.JSX.Element {
    const facilityService = new FacilityService();
    const miscService = new MiscService();

    const [facilities, setFacilities] = useState([]);

    useEffect(() => {
        // const token = await getToken();
        // let config = {
        //     headers: {
        //         Authorization: ''
        //     }
        // };

        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }

        facilityService.list().then((response) => {
            console.log('facilityService', response.data);
            setFacilities(response.data?.data);
        }).catch((error) => {
            console.log('faciltiyService::list dashboard', error);
        });

        // getCompanyData().then((data: string | null) => {
        //     if (data !== null) {
        //         let parsedData = JSON.parse(data);
        //         console.log('parsedData-------', parsedData)

        //         if (parsedData.logo == null)
        //             parsedData.logo = require('./../../assets/images/liber_logo.png');

        //         storeCompanyData({ ...parsedData });
        //     }
        // });
    }, []);

    // useEffect(() => {
    //     // miscService.lists().then((response) => {
    //     //     storeFacilityTypes(response.data?.data?.facility_types);
    //     //     storeCountries(response.data?.data?.countries);
    //     //     console.log(response.data?.data);
    //     // }).catch((error) => {

    //     // });
    // }, []);

    const getItem = (_data: unknown, index: number): ItemData => facilities[index];

    const getItemCount = (_data: unknown) => facilities.length;

    return (
        <SafeAreaView style={styles.container}>
            <VirtualizedList
                initialNumToRender={6}
                renderItem={({ item }) => <FacilityCard facility={item} />}
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
        marginTop: 5,

    },
    item: {
        backgroundColor: colors.PrimaryBlue,
        height: 150,
        marginVertical: 8,
        marginHorizontal: 16,
        padding: 20,
    },
    title: {
        fontSize: 32,
    },
});
