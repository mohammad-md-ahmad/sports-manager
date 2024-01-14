import React from "react";

import {
    Dimensions,
    StyleSheet,
    Text,
    View,
} from "react-native";
import globalStyles from "../../styles/styles";
import { BarChart, LineChart } from "react-native-chart-kit";
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
        ],
        legend: ["Rainy Days"] // optional
    };

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
        <View style={globalStyles.containerView}>
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
    );
}

const styles = StyleSheet.create({
    cardView: {
        borderRadius: 10,
        borderColor: colors.PrimaryGreenLight,
        borderWidth: 0.5,
        marginHorizontal: 15,
        marginTop: 7,
        marginBottom: 7
    },
})
