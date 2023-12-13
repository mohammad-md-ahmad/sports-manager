// Loader.tsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import { Overlay } from 'react-native-elements';

interface LoaderProps {
    loading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ loading }) => {
    if (!loading) return null;

    return (
        <View>
            <Overlay isVisible={loading} overlayStyle={styles.overlay} >
                <ActivityIndicator size="large" color={colors.PrimaryBlue} />
            </Overlay>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    }
});

export default Loader;
