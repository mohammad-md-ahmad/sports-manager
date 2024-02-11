import React, { useState } from "react";

import {
    SafeAreaView,
    StyleSheet,
    VirtualizedList,
} from "react-native";
import colors from "../../styles/colors";
import { useFocusEffect } from "@react-navigation/native";
import CompanyCard from "../common/companyCard";
import CompanyService from "../../api/CompanyService";
import { useDispatch, useSelector } from "react-redux";
import { GlobaSateKey } from "../../helpers/constants";
import MasonryList from '@react-native-seoul/masonry-list';
import AdService from "../../api/AdService";

export default function UserDashboard(): React.JSX.Element {
    const companyService = new CompanyService();
    const adService = new AdService();

    const [companies, setCompanies] = useState([]);
    const [combinedData, setCombinedData] = useState([]);

    const companiesList = useSelector(state => state.companiesList);

    const dispatch = useDispatch();

    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.

            loadData();
        }, [])
    );

    const loadData = () => {
        let companiesData = [];
        let adsData = [];

        adService.list({})
            .then((adsResponse) => {
                adsData = adsResponse.data?.data?.data;

                if (companiesList) {
                    companiesData = companiesRespones.data?.data?.data;
                    buildCombinedData(companiesData, adsData);
                }
                else {
                    companyService.list({}).then((companiesRespones) => {
                        companiesData = companiesRespones.data?.data?.data;

                        buildCombinedData(companiesData, adsData);
                        dispatch({ type: GlobaSateKey.SetCompaniesList, payload: companiesRespones.data?.data?.data });
                    }).catch((error) => {
                    })
                }

            })
            .catch((error) => {
            });
    }

    const buildCombinedData = (companiesData, adsData) => {
        let combinedArray = [];
        let adsCounter = 0;
        for (let i = 0; i < companiesData.length; i++) {
            if (i % 3 == 0 && i != 0) {
                if (adsData[adsCounter]) {
                    adsData[i].cardType = DashboardCardType.Ad;
                    combinedArray.push(adsData[adsCounter]);
                    adsCounter++;
                }
            }
            companiesData[i].cardType = DashboardCardType.Company;
            combinedArray.push(companiesData[i]);
        }
        setCombinedData(combinedArray);
    }


    // const getItem = (_data: unknown, index: number) => companies[index] ?? 0;
    // const getItemCount = (_data: unknown) => companies?.length ?? 0;

    return (
        <SafeAreaView style={styles.container}>
            {/* <VirtualizedList
                initialNumToRender={6}
                renderItem={({ item }) => <CompanyCard company={item} />}
                keyExtractor={item => item.uuid}
                getItemCount={getItemCount}
                getItem={getItem}
            /> */}

            <MasonryList
                data={companies}
                renderItem={({ item }) => <CompanyCard company={item} />}
                keyExtractor={item => item.uuid}
                numColumns={1}
                onRefresh={loadDate}
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
