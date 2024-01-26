import React from "react";

import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import globalStyles from "../../styles/styles";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { Card } from "react-native-elements";
import colors from "../../styles/colors";

export default function Reports(): React.JSX.Element {

    const data = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43],
                color: (opacity = 1) => `rgba(100, 100, 225, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }
            ,{
                data: [17, 12, 58, 40, 35, 18],
                color: (opacity = 0.5) => `rgba(100, 100, 225, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }
        ],
        legend: ["Rainy Days"] // optional
    };

    const pieChartData = [
        {
            name: "Seoul",
            population: 21500000,
            color: "rgba(131, 167, 234, 1)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Toronto",
            population: 2800000,
            color: "#F00",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Beijing",
            population: 527612,
            color: "red",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "New York",
            population: 8538000,
            color: "#ffffff",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Moscow",
            population: 11920000,
            color: "rgb(0, 0, 255)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        }
    ];

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
        <ScrollView>
            <SafeAreaView style={styles.container}>
                <View>
                    <Card containerStyle={styles.cardView}>
                        <PieChart
                            data={pieChartData}
                            width={screenWidth}
                            height={256}
                            chartConfig={chartConfig}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                            center={[0, 0]}
                            absolute
                        />
                    </Card>
                </View>

                <View >
                    <Card containerStyle={styles.cardView}>
                        <LineChart
                            data={data}
                            width={screenWidth}
                            height={256}
                            verticalLabelRotation={30}
                            chartConfig={chartConfig}
                            bezier
                        />
                    </Card>
                </View>

                <View>
                    <Card containerStyle={styles.cardView}>
                        <BarChart
                            //style={graphStyle}
                            data={data}
                            width={screenWidth}
                            height={220}
                            yAxisLabel="$"
                            chartConfig={chartConfig}
                            verticalLabelRotation={30}
                        />
                    </Card>
                </View>

            </SafeAreaView >
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
})
