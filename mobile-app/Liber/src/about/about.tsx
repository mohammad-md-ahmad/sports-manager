import React, { useEffect, useState } from "react";

import {
    StyleSheet,
    Text,
    View,
} from "react-native";
import globalStyles from "../../styles/styles";
import AppInfoService from "../../api/AppInfoService";

export default function About(): React.JSX.Element {

    const appInfoService = new AppInfoService();

    const [appInfo, setAppInfo] = useState([]);
    useEffect(() => {
        appInfoService.getInfo({ "key": "about" })
            .then((response) => {
                setAppInfo(response.data?.data);
            }).catch((error) => {
            });

    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{appInfo?.about}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.containerView,
        justifyContent: 'center',
    },
    text: {
        ...globalStyles.text,
        paddingHorizontal: 25,
    },
});
