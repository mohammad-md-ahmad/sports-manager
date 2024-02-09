import React, { useEffect, useState } from "react";

import {
    Dimensions,
    StyleSheet,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { Card } from "react-native-elements";
import colors from "../../styles/colors";
import { AgeRanges, AgeRangesColors } from "../../helpers/constants";

interface ReportsData {
    genders: [];
    ages: [];
    users_per_month: [];
    revenue_per_year: [];
}

interface ReportsDataProps {
    reportsData: ReportsData;
}

const DemographicsReport: React.FC<ReportsDataProps> = ({ reportsData }) => {

    const [genders, setGenders] = useState([]);
    const [ages, setAges] = useState([]);
    const [usersPerMonth, setUsersPerMonth] = useState(null);

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

    const transformDataForChart = (data) => {
        // Extracting unique months and their counts
        const months = data.map((entry) => entry.month);
        const uniqueMonths = [...new Set(months)];

        // Creating datasets
        const datasets = [
            {
                data: uniqueMonths.map((month) => {
                    const entry = data.find((item) => item.month === month);
                    return entry ? entry.count : 0;
                }),
                color: (opacity = 1) => `rgba(100, 100, 225, ${opacity})`,
                strokeWidth: 2,
            },
        ];

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
            legend: ['User Distribution'],
        };

        return chartData;
    };


    useEffect(() => {
        if (reportsData) {
            reportsData?.genders.map(obj => {
                obj.name = obj.gender ?? "Not set";
                obj.color = obj.gender == 'Male' ? colors.PrimaryBlue : colors.SecondaryPurple
                return obj;
            })
            setGenders(reportsData?.genders);

            const resultArray = transformObjectToArray(reportsData?.ages);
            setAges(resultArray);

            setUsersPerMonth(transformDataForChart(reportsData?.users_per_month));
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
                {usersPerMonth && <>
                    <Card.Divider />
                    <Card.Title>Users Per Month</Card.Title>
                    <BarChart
                        //style={graphStyle}
                        data={usersPerMonth}
                        width={screenWidth}
                        height={250}
                        yAxisLabel=""
                        chartConfig={chartConfig}
                        verticalLabelRotation={30}
                    />
                </>
                }
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


export default DemographicsReport;
