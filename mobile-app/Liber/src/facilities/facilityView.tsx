import React, { useEffect } from "react";

import {
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";
import globalStyles from "../../styles/styles";
import colors from "../../styles/colors";
import Swiper from "react-native-swiper";
import { useSelector } from "react-redux";

function FacilityView({ route }): React.JSX.Element {
    const { facility } = route?.params ?? {};

    const facilityTypes = useSelector(state => state.facilityTypes);
    return (
        <View style={styles.containerView}>
            <View style={styles.container}>
                {facility?.gallery ?
                    <View style={styles.swiperContainer}>
                        <Swiper style={styles.wrapper} showsButtons={true}>
                            {
                                facility?.gallery?.map((galleryItem, index) => (
                                    <View style={styles.slide}>
                                        <Image
                                            source={galleryItem.image ? { uri: galleryItem.image } : require('./../../assets/images/liber_logo.png')}
                                            style={styles.image}
                                        />
                                    </View>
                                ))
                            }
                        </Swiper>
                    </View> : <></>
                }
                <View style={styles.userInfo}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.value}>{facility?.name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Type:</Text>
                        <Text style={styles.value}>{facilityTypes[facility?.type]}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Length:</Text>
                        <Text style={styles.value}>{facility?.details.length}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Width:</Text>
                        <Text style={styles.value}>{facility?.details.width}</Text>
                    </View>
                </View>
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
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.PrimaryBlue,
        width: 100,
    }, value: {
        fontSize: 18,
        fontWeight: 'normal',
        color: colors.PrimaryBlue
    },
    row: {
        flexDirection: 'row',
    },
});

export default FacilityView;
