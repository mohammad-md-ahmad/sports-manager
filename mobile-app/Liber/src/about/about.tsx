import React, { useEffect, useState } from "react";

import {
    Linking,
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

export default function About(): React.JSX.Element {

    const appInfoService = new AppInfoService();

    const [appInfo, setAppInfo] = useState([]);
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
                // Fallback: Open WhatsApp using a standard HTTP link
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
        </View>
    );
};

const styles = StyleSheet.create({
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
    }
});