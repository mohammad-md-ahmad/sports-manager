import React from "react";

import {
    Text,
    View,
} from "react-native";
import styles from "../../styles/styles";

export default function About(): React.JSX.Element {

    return (
        <View style={styles.containerView}>
            <Text style={styles.text}>here is the about</Text>

        </View>
    );
}
