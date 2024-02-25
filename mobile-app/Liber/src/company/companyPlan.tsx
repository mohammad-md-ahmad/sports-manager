import React, { useEffect, useState } from "react";

import {
    StyleSheet,
    Text,
    View,
} from "react-native";
import globalStyles from "../../styles/styles";
import { useSelector } from "react-redux";
import Swiper from "react-native-swiper";
import colors from "../../styles/colors";
import { Image } from "react-native-elements";
import { ActivityIndicator } from "react-native-paper";
import MasonryList from '@react-native-seoul/masonry-list';
import CompanyImageCard from "./companyImageCard";
import fonts from "../../styles/fonts";

export default function CompanyPlan(): React.JSX.Element {
    const companyCurrentPlan = useSelector(state => state.companyCurrentPlan);

    return (
        <View style={styles.containerView}>
            <Text style={styles.description}>{companyCurrentPlan?.name}</Text>
            <Text style={styles.description}>{companyCurrentPlan?.type}</Text>
            <Text style={styles.description}>{companyCurrentPlan?.effective_from}</Text>
            <Text style={styles.description}>{companyCurrentPlan?.effective_to}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    containerView: {
        ...globalStyles.containerView,
        alignItems: "flex-start",
        paddingTop: 10
    },
    description: {
        ...globalStyles.text,
        fontFamily: fonts.Poppins.medium,
        fontSize: 16,
        color: colors.PrimaryBlue,
    },

});