import React, { useEffect, useState } from "react";

import {
    SafeAreaView,
    StyleSheet,
    VirtualizedList,
} from "react-native";
import colors from "../../styles/colors";
import MiscService from "../../api/MiscService";
import { useFocusEffect } from "@react-navigation/native";
import { storeFacilityTypes } from "../../helpers/facilityTypesDataManage";
import { storeCountries } from "../../helpers/countriesDataManage";
import CompanyService from "../../api/CompanyService";
import CompanyCard from "../common/companyCard";
import { useDispatch, useSelector } from "react-redux";
import { GlobaSateKey } from "../../helpers/constants";

export default function CompanyDashboard(): React.JSX.Element {
    const companyService = new CompanyService();
    const miscService = new MiscService();

    const [companies, setCompanies] = useState([]);

    const companiesList = useSelector(state => state.companiesList);

    const dispatch = useDispatch();

    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.

            if (companiesList) {
                setCompanies(companiesList);
            } else {
                companyService.list({})
                    .then((response) => {
                        setCompanies(response.data?.data?.data);
                        dispatch({ type: GlobaSateKey.SetCompaniesList, payload: response.data?.data?.data });
                    }).catch((error) => {
                    });
            }

        }, [])
    );

    const getItem = (_data: unknown, index: number) => companies[index] ?? 0;
    const getItemCount = (_data: unknown) => companies?.length ?? 0;

    return (
        <SafeAreaView style={styles.container}>
            <VirtualizedList
                initialNumToRender={6}
                renderItem={({ item }) => <CompanyCard company={item} />}
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
