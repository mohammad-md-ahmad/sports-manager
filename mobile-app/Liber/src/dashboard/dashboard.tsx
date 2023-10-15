import React from "react";

import {
    Text,
    View,
} from "react-native";
import globalStyles from "../../styles/styles";

export default function Dashboard(): React.JSX.Element {
    return (
        <View style={globalStyles.containerView}>
            <Text style={globalStyles.text}>here is the dashboard</Text>
        </View>
    );
}
