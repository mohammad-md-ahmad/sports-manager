import React, { useEffect, useState } from "react";

import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import globalStyles from "../../styles/styles";
import AppInfoService from "../../api/AppInfoService";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import Icon from 'react-native-vector-icons/FontAwesome'; // You can use another icon library
import SubscriptionPlanService from "../../api/SubscriptionPlanService";
import { useSelector } from "react-redux";
import { UserType } from "../../helpers/constants";

export default function About(): React.JSX.Element {

    const appInfoService = new AppInfoService();
    const subscriptionPlanService = new SubscriptionPlanService();
    const user = useSelector(state => state.authUserData);

    const [appInfo, setAppInfo] = useState([]);
    const [subscriptionPlans, setSubscriptionPlans] = useState([]);

    const getPlans = () => {
        let plans = subscriptionPlans.map((item) => (
            <View style={styles.cardContainer}>
                <View style={styles.row}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{item.name}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Type:</Text>
                    <Text style={styles.value}>{item.type}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Price:</Text>
                    <Text style={styles.value}> {item.decimal_price} {item.currency.iso_short_code}</Text>
                </View>
                <Text style={styles.description}>{item.description}</Text>
                {/* Add more details or styling as needed */}
            </View>));

        return plans;
    }

    useEffect(() => {
        appInfoService.getAllInfo()
            .then((response) => {
                console.log(response.data?.data?.data)
                const dataArray = response.data?.data?.data;
                const resultObject = dataArray.reduce((acc, item) => {
                    acc[item.key.toLowerCase()] = item.value;
                    return acc;
                }, {});
                console.log('resultObject', resultObject)
                setAppInfo(resultObject);

                subscriptionPlanService.list()
                    .then((subscriptionResponse) => {
                        setSubscriptionPlans(subscriptionResponse?.data?.data?.data);
                    }).catch((error) => {
                    });

            }).catch((error) => {
            });

    }, []);

    const openWhatsApp = async () => {
        const url = `whatsapp://send?phone=${appInfo?.phone}`;

        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                return Linking.openURL(url);
            } else {
                // Fallback: Open WhatsApp using a standard HTTP link
                return Linking.openURL(`https://wa.me/${appInfo?.phone}`);
            }
        } catch (error) {
            console.error('Error opening WhatsApp:', error);
        }
    };

    const openEmail = async () => {
        const url = `mailto:${appInfo?.email}`;

        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                return Linking.openURL(url);
            } else {
                // Fallback: Open Email using a standard HTTP link
                return Linking.openURL(url);
            }
        } catch (error) {
            console.error('Error opening email:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.about}>{appInfo?.about}</Text>
            </View>

            <TouchableOpacity style={styles.section} onPress={openWhatsApp}>
                <Text style={styles.phone}><Icon name="whatsapp" size={20} color="#25D366" /> {appInfo?.phone}</Text>
                <Text style={styles.text}>
                    Click to open WhatsApp
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.section} onPress={openEmail}>
                <Text style={styles.email}><Icon name="envelope" size={18} color="#007bff" /> {appInfo?.email}</Text>
                <Text style={styles.text}>
                    Click to open Email
                </Text>
            </TouchableOpacity>

            {(subscriptionPlans.length > 0 && user.type == UserType.CompanyUser) &&
                <ScrollView>
                    {getPlans()}
                </ScrollView>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        marginTop: 7,
        marginBottom: 7,
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: 10,
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    section: {
        ...globalStyles.text,
        fontFamily: fonts.Poppins.regular,
        marginBottom: 20,
    },
    sectionTitle: {
        ...globalStyles.text,
        fontSize: 20,
        fontFamily: fonts.Poppins.bold,
        marginBottom: 5,
        color: colors.PrimaryBlue,
    },
    about: {
        ...globalStyles.text,
        fontSize: 18,
        fontFamily: fonts.Poppins.regular,
        marginBottom: 5,
        color: colors.PrimaryBlue,
    },
    email: {
        ...globalStyles.text,
        fontSize: 18,
        fontFamily: fonts.Poppins.bold,
        marginBottom: 5,
        color: colors.PrimaryBlue,
    },
    phone: {
        ...globalStyles.text,
        fontSize: 18,
        fontFamily: fonts.Poppins.bold,
        marginBottom: 5,
        color: colors.PrimaryBlue,
    },
    text: {
        ...globalStyles.text,
        fontFamily: fonts.Poppins.regular,
        marginBottom: 5,
        color: colors.PrimaryBlue,
    },
    label: {
        ...globalStyles.text,
        fontSize: 18,
        fontFamily: fonts.Poppins.bold,
        color: colors.PrimaryBlue,
        width: 100,
    },
    value: {
        ...globalStyles.text,
        fontSize: 18,
        fontFamily: fonts.Poppins.regular,
        color: colors.PrimaryBlue
    },
    description: {
        ...globalStyles.text,
        marginTop: 10,
        fontSize: 19,
        fontFamily: fonts.Poppins.medium,
        color: colors.PrimaryBlue
    },
    row: {
        flexDirection: 'row',
    },
});