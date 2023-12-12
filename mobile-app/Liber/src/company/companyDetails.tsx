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

export default function CompanyDetails(): React.JSX.Element {
    const companyData = useSelector(state => state.companyData);


    const onLoadEnd = () => {
        console.log('Success loading image');
    };

    const onError = () => {
        // Handle error if the image fails to load
        console.log('Error loading image');
    };

    useEffect(() => {

    }, [companyData])

    return (
        <View style={globalStyles.containerView}>
            {/* <View style={styles.swiperContainer}>

                {companyData?.gallery ?
                    <Swiper showsButtons={true}>
                        {
                            companyData?.gallery?.map((galleryItem, index) => (
                                <View style={styles.slide}>
                                    <Image
                                        source={galleryItem.image ? { uri: galleryItem.image } : require('./../../assets/images/liber_logo.png')}
                                        style={styles.image}
                                        onLoadEnd={onLoadEnd}
                                        onError={onError}
                                    />
                                </View>
                            ))
                        }
                    </Swiper>
                    :
                    <>
                        <Text style={styles.subName}>No Images</Text>
                    </>
                }
            </View> */}

            {companyData?.gallery ?
                <>
                    <MasonryList
                        data={companyData?.gallery}
                        placeholderImage={require('./../../assets/images/liber_logo.png')}
                        renderItem={(galleryItem) => (
                            <View style={styles.item}>
                                <Image
                                    source={galleryItem?.item?.image ? { uri: galleryItem?.item?.image } : require('./../../assets/images/liber_logo.png')}
                                    style={styles.image}
                                    onLoadEnd={onLoadEnd}
                                    onError={onError}
                                />
                            </View>
                        )}
                        numColumns={2}
                        columnWidth={150}
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
