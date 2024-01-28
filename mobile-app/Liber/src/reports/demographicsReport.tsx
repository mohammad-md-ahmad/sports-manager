import React, { useState } from "react";

import {
    Dimensions,
    StyleSheet,
    View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Card } from "react-native-elements";
import colors from "../../styles/colors";
import { useFocusEffect } from "@react-navigation/native";
import ReportsService from "../../api/ReportsService";
import { AgeRanges, AgeRangesColors, ReportNames } from "../../helpers/constants";

export default function DemographicsReport(): React.JSX.Element {

    const reportsService = new ReportsService();

    const [genders, setGenders] = useState([]);
    const [ages, setAges] = useState([]);

    const transformObjectToArray = (inputObject) => {
        return Object.entries(inputObject).map(([name, count]) => ({
            name: AgeRanges[name] ?? "()",
            count: parseInt(count, 10),
            color: AgeRangesColors[name] ?? getRandomColor()
        }));
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.

            reportsService.getReport(ReportNames.CustomerDemographics).then((response) => {
                console.log("CustomerDemographics", response?.data?.data)
                response?.data?.data?.genders.map(obj => {
                    obj.name = obj.gender;
                    obj.color = obj.gender == 'Male' ? colors.PrimaryBlue : colors.SecondaryPurple
                    return obj;
                })
                setGenders(response?.data?.data?.genders);

                const resultArray = transformObjectToArray(response?.data?.data?.ages);
                setAges(resultArray);

            }).catch((error) => {
            });

        }, [])
    );

    const screenWidth = Dimensions.get("window").width - 50;

    const chartConfig = {
        backgroundGradientFrom: colors.PrimaryBlueLight,
        backgroundGradientFromOpacity: 0.1,
        backgroundGradientTo: colors.PrimaryBlueLight,
        backgroundGradientToOpacity: 0.1,
        color: (opacity = 1) => `rgba(100, 200, 225, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };

    return (
        <>
            <Card containerStyle={styles.cardView}>
                <Card.Title>Demographics</Card.Title>
                <Card.Divider />
                <Card.Title>Genders Report</Card.Title>
                <PieChart
                    data={genders}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                    accessor={"count"}
                    backgroundColor={"transparent"}
                    paddingLeft={"25"}
                    center={[0, 0]}
                    absolute
                />
                <Card.Divider />
                <Card.Title>Ages Report</Card.Title>
                <PieChart
                    data={ages}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                    accessor={"count"}
                    backgroundColor={"transparent"}
                    paddingLeft={"25"}
                    center={[0, 0]}
                    absolute
                />
            </Card>
        </>
    );
}

const styles = StyleSheet.create({
    masterCardView: {
        borderColor: colors.PrimaryGreenLight,
        marginTop: 0,
        marginBottom: 0,
        backgroundColor: colors.PrimaryGreenLight
    }, cardView: {
        borderRadius: 10,
        borderColor: colors.PrimaryGreenLight,
        borderWidth: 0.5,
        marginHorizontal: 15,
        marginTop: 7,
        marginBottom: 7
    },
})
