import React, { useState } from "react";

import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
} from "react-native";
import globalStyles from "../../styles/styles";
import colors from "../../styles/colors";
import DemographicsReport from "./demographicsReport";
import RevenuePerYearReport from "./revenuePerYearReport";
import { useFocusEffect } from "@react-navigation/native";
import ReportsService from "../../api/ReportsService";
import { ReportNames, SubscriptionPlanType } from "../../helpers/constants";
import { useSelector } from "react-redux";
import fonts from "../../styles/fonts";
import { View } from "react-native";

export default function Reports(): React.JSX.Element {
    const reportsService = new ReportsService();

    const [reportsData, setReportsData] = useState(null);

    const companyCurrentPlan = useSelector(state => state.companyCurrentPlan);

    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.

            reportsService.getReport(ReportNames.CustomerDemographics).then((response) => {
                setReportsData(response?.data?.data);
            }).catch((error) => {
            });

        }, [])
    );

    return (
        <ScrollView style={styles.scrollView}>
            <SafeAreaView style={styles.container}>
                {companyCurrentPlan?.is_active ?
                    <>
                        <DemographicsReport reportsData={reportsData}></DemographicsReport>
                        <RevenuePerYearReport reportsData={reportsData}></RevenuePerYearReport>
                    </> :
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>You must have an active Premium plan to see the reports</Text>
                        </View>
                    </>
                }

            </SafeAreaView >
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: colors.White,
    },
    container: {
        ...globalStyles.containerView,
    },
    cardView: {
        borderRadius: 10,
        borderColor: colors.PrimaryGreenLight,
        borderWidth: 0.5,
        marginHorizontal: 15,
        marginTop: 7,
        marginBottom: 7
    },
    section: {
        ...globalStyles.text,
        fontFamily: fonts.Poppins.regular,
        marginTop: 20,
    },
    sectionTitle: {
        ...globalStyles.text,
        fontFamily: fonts.Poppins.bold,
        color: colors.PrimaryBlue,
    },
})
