import React from "react";

import {
    Text,
    View,
} from "react-native";
import globalStyles from "../../styles/styles";

export default function About(): React.JSX.Element {

    return (
        <View style={globalStyles.containerView}>
            <Text style={globalStyles.text}>here is the about</Text>

        </View>
    );
}
