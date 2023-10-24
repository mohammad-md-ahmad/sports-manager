import React, { useEffect, useState } from "react";

import {
    SafeAreaView,
    StyleSheet,
    VirtualizedList,
} from "react-native";
import colors from "../../styles/colors";
import FacilityCard from "../common/facilityCard";
import FacilityService from "../../api/FacilityService";
import { useFocusEffect } from "@react-navigation/native";
import MiscService from "../../api/MiscService";
import { storeCountries } from "../../helpers/countriesDataManage";
import { storeFacilityTypes } from "../../helpers/facilityTypesDataManage";

export default function Dashboard(): React.JSX.Element {
    const facilityService = new FacilityService();
    const miscService = new MiscService();

    const [facilities, setFacilities] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.

            facilityService.list()
                .then((response) => {
                    setFacilities(response.data?.data);
                }).catch((error) => {
                });

                miscService.lists().then((response) => {
                    storeFacilityTypes(response.data?.data?.facility_types);
                    storeCountries(response.data?.data?.countries);
                }).catch((error) => {
                    console.log(error);
                });
        }, [])
    );

    const getItem = (_data: unknown, index: number) => facilities[index];
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
