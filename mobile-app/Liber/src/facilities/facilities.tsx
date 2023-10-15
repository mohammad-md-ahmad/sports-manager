import React from "react";

import {
    StyleSheet,
    Text,
    View,
} from "react-native";
import globalStyles from "../../styles/styles";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-elements";
import fonts from "../../styles/fonts";

function Facilities(): React.JSX.Element {
    const navigator = useNavigation();

    function onAddFacilityPress(): void {
        navigator.navigate('FacilityForm');
    }

    return (
        <View style={globalStyles.containerView}>
            <Text style={globalStyles.text}>here is the the facilities dashboard</Text>
            <Button
                onPress={() => onAddFacilityPress()}
                title="Add Facility"
                buttonStyle={styles.button}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
        borderWidth: 0,
        resizeMode: 'contain',
    },
    name: {
        ...globalStyles.text,
        fontSize: 20,
        marginBottom: 5,
        color: 'gray',
    },
    description: {
        ...globalStyles.text,
        fontFamily: fonts.Poppins.medium,
        padding: 10,
        fontSize: 16,
        color: 'gray',
        marginBottom: 20,
    },
    infoContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    label: {
        width: 100,
        fontWeight: 'bold',
    },
    value: {
        flex: 1,
    },
    button: {
        ...globalStyles.button,
        width: 250,
    },
});

export default Facilities;
