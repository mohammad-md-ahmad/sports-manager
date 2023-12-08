import React, { useEffect, useState } from "react";

import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import colors from "../../styles/colors";
import { Card } from "react-native-elements";

export default function CompanyDashboard(): React.JSX.Element {

    return (
        <SafeAreaView style={styles.containerView}>
            <ScrollView>
                <Card containerStyle={styles.cardView}>
                    <Card.Title>Dashboard Widget 1</Card.Title>

                    <Card.Divider />
                    <View style={{ position: "relative", alignItems: "center" }}>
                        <Text >Details </Text>
                    </View>
                    <View style={styles.container}>


                    </View>
                </Card>

                <Card containerStyle={styles.cardView}>
                    <Card.Title>Dashboard Widget 2</Card.Title>

                    <Card.Divider />
                    <View style={{ position: "relative", alignItems: "center" }}>
                        <Text >Details </Text>
                    </View>
                    <View style={styles.container}>


                    </View>
                </Card>

                <Card containerStyle={styles.cardView}>
                    <Card.Title>Dashboard Widget 3</Card.Title>

                    <Card.Divider />
                    <View style={{ position: "relative", alignItems: "center" }}>
                        <Text >Details </Text>
                    </View>
                    <View style={styles.container}>


                    </View>
                </Card>

                <Card containerStyle={styles.cardView}>
                    <View style={styles.container}>

                        <Card.Title>Dashboard Widget 4</Card.Title>

                        <Card.Divider />
                        <View style={{ position: "relative", alignItems: "center" }}>
                            <Text >Details </Text>
                        </View>
                        <View style={styles.container}>


                        </View>
                    </View>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        marginVertical: 0,

    },
    cardView: {
        borderRadius: 10,
        borderColor: colors.PrimaryGreenLight,
        borderWidth: 0.5,
        marginHorizontal: 15,
        marginTop: 7,
        marginBottom: 7
    },
    container: {
        height: 200
    },

});
