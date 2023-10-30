import React from "react";

import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";

function ErrorView({ errorData }): React.JSX.Element {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Errors:</Text>
            <FlatList
                data={Object.keys(errorData)}
                renderItem={({ item }) => (
                    <View style={styles.errorItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.errorMessage}>{errorData[item][0]}</Text>
                    </View>
                )}
                keyExtractor={(item) => item}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.SecondaryRed,
        padding: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: fonts.Poppins.bold,
        color: colors.SecondaryRed, // Choose your text color
    },
    errorItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    bullet: {
        fontSize: 20,
        marginRight: 5,
        color: colors.SecondaryRed, // Choose your bullet color
    },
    errorMessage: {
        flex: 1,
        color: colors.SecondaryRed, // Choose your text color
        fontFamily: fonts.Poppins.regular,
    },
});
export default ErrorView;
