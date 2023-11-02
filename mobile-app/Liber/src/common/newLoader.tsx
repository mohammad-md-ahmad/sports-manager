import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';

export const NewLoader = ({ isLoading = false, withText = false }) => {
    return isLoading ? (
        <View style={styles.loader}>
            <ActivityIndicator size='large' color='#aaaaaa' />
            {withText ? (
                <Text style={{ color: 'green' }}>Loading...</Text>
            ) : null}
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    loader: {
        marginVertical: 15,
        alignItems: 'center',
    },
});