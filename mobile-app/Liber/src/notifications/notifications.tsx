import React from "react";

import {
    Text,
    View,
} from "react-native";
import globalStyles from "../../styles/styles";

export default function Notifications(): React.JSX.Element {

    return (
        <View style={globalStyles.tabContainerView}>
            <Text style={globalStyles.text}>here is the Notifications</Text>
        </View>
    );
}
