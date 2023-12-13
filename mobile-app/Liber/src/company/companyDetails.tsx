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

export default function CompanyDetails(): React.JSX.Element {
    const companyData = useSelector(state => state.companyData);

    useEffect(() => {

    }, [companyData])

    return (
        <View style={styles.containerView}>
            <Text style={styles.description}>{companyData?.description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    containerView: {
        ...globalStyles.containerView,
        alignItems: "flex-start",
    },
    description: {
        ...globalStyles.text,
        fontFamily: fonts.Poppins.medium,
        padding: 10,
        fontSize: 16,
        color: 'gray',
    },

});
