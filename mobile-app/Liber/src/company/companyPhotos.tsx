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

export default function CompanyPhotos(): React.JSX.Element {
    const companyData = useSelector(state => state.companyData);


    const onLoadEnd = () => {
    };

    const onError = () => {
        // Handle error if the image fails to load
    };

    useEffect(() => {

    }, [companyData])

    const renderItem = (item) => {
        return <CompanyImageCard companyImage={item.item} />
    }

    return (
        <View style={styles.containerView}>
            {companyData?.gallery ?
                <>
                    <MasonryList
                        data={companyData?.gallery}
                        renderItem={renderItem}
                        numColumns={2}
                    />
                </>
                :
                <>
                    <Text style={styles.subName}>No Images</Text>
                </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    containerView: {
        ...globalStyles.containerView
    },
    container: {
        //flexDirection: 'row',
        //height: 100,
    },
    swiperContainer: {
        height: '50%'
    },
    wrapper: {
    },
    slide: {
        backgroundColor: 'red',
        //flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
        borderRadius: 15,
    },
    userInfo: {
        flexDirection: 'column',
        padding: 10
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.PrimaryBlue
    }, subName: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.PrimaryBlue
    },
    item: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },

});
