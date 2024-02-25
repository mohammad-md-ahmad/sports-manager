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
            <Text style={styles.description}>Plan Name : {companyCurrentPlan?.subscription_plan?.name}</Text>
            <Text style={styles.description}>Plan Type : {companyCurrentPlan?.subscription_plan?.type}</Text>
            <Text style={styles.description}>Is Active : {companyCurrentPlan?.is_active ? 'Yes' : 'No'}</Text>
            <Text style={styles.description}>Effective From : {companyCurrentPlan?.effective_from ? companyCurrentPlan?.effective_from.split(' ')[0] : ''}</Text>
            <Text style={styles.description}>Effective To : {companyCurrentPlan?.effective_to ? companyCurrentPlan?.effective_to.split(' ')[0] : ''}</Text>
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
