import React from "react";

import {
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";
import globalStyles from "../../styles/styles";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-elements";
import fonts from "../../styles/fonts";
import { Screens } from "../../helpers/constants";
import colors from "../../styles/colors";
import Swiper from "react-native-swiper";

function FacilityView({ route }): React.JSX.Element {
    const { facility } = route?.params ?? {};

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
                    <Text style={styles.name}>Name: {facility?.name}</Text>
                    <Text style={styles.subName}>Type: {facility?.type}</Text>
                    <Text style={styles.subName}>Length: {facility?.details.length}</Text>
                    <Text style={styles.subName}>Width: {facility?.details.width}</Text>
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
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.PrimaryBlue
    }, subName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.PrimaryBlue
    },
});

export default FacilityView;
