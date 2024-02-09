import React, { useEffect, useState } from "react";
import {
    Dimensions,
    StyleSheet,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Card } from "react-native-elements";
import colors from "../../styles/colors";

interface ReportsData {
    genders: [];
    ages: [];
    users_per_month: [];
    revenue_per_year: [];
}

interface ReportsDataProps {
    reportsData: ReportsData;
}


const RevenuePerYearReport: React.FC<ReportsDataProps> = ({ reportsData }) => {

    const [revenuePerMonth, setRevenuePerMonth] = useState(null);

    const transformDataForChart = (data) => {
        data = [{ ...data }] // to be removed
        // Extracting unique months and their counts
        const months = data.map((entry) => entry.month);
        const uniqueMonths = [...new Set(months)];

        // Creating datasets
        const datasets = [
            {
                data: uniqueMonths.map((month) => {
                    const entry = data.find((item) => item.month === month);
                    return entry ? entry.amount : 0;
                }),
                color: (opacity = 1) => `rgba(100, 100, 225, ${opacity})`,
                strokeWidth: 2,
            },
        ];

        console.log("datasets", datasets)
        // Creating labels
        const labels = uniqueMonths.map((month) => {
            // Assuming you want to use month names instead of numbers
            const monthNames = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ];

            return monthNames[month - 1]; // Adjusting for 0-based indexing of arrays
        });

        // Creating the final chart data object
        const chartData = {
            labels,
            datasets,
            legend: ['Revenue Distribution'],
        };

        return chartData;
    };

    useEffect(() => {
        if (reportsData) {
            setRevenuePerMonth(transformDataForChart(reportsData?.revenue_per_year));
        }
    }, [reportsData])

    const screenWidth = Dimensions.get("window").width - 50;

    const chartConfig = {
        backgroundGradientFrom: colors.PrimaryBlueLight,
        backgroundGradientFromOpacity: 0.05,
        backgroundGradientTo: colors.PrimaryBlueLight,
        backgroundGradientToOpacity: 0.1,
        color: (opacity = 1) => `rgba(140, 198, 60, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };

    return (
        <>
            {revenuePerMonth && <Card containerStyle={styles.cardView}>
                <Card.Title>Revenue Per Year</Card.Title>
                <>
                    <Card.Divider />
                    <BarChart
                        //style={graphStyle}
                        data={revenuePerMonth}
                        width={screenWidth}
                        height={250}
                        yAxisLabel="LBP-"
                        chartConfig={chartConfig}
                        verticalLabelRotation={30}
                    />
                </>

            </Card>
            }
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


export default RevenuePerYearReport;