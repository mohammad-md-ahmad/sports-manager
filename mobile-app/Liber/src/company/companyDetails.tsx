import React from "react";

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

export default function CompanyDetails(): React.JSX.Element {
    const companyData = useSelector(state => state.companyData);
    return (
        <View style={globalStyles.containerView}>
            <View style={styles.swiperContainer}>
                {companyData?.gallery ?
                    <Swiper style={styles.wrapper} showsButtons={true}>
                        {
                            companyData?.gallery?.map((galleryItem, index) => (
                                <View style={styles.slide}>
                                    <Image
                                        source={galleryItem.image ? { uri: galleryItem.image } : require('./../../assets/images/liber_logo.png')}
                                        style={styles.image}
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
            </View>

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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
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
});
