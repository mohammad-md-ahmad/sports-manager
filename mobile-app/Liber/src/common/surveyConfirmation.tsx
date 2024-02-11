import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import colors from '../../styles/colors';


const SurveyConfirmation = ({ isVisible, onConfirm }) => {
    return (
        <Modal isVisible={isVisible} style={styles.modal}>
            <View style={styles.container}>
                <Text style={styles.title}>Survey Confirmation</Text>
                <Text style={styles.message}>Thank you for filling the survey</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={onConfirm} style={[styles.button, styles.confirmButton]}>
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        width: 300,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    message: {
        fontSize: 16,
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: colors.PrimaryBlue,
        marginRight: 8,
    },

    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default SurveyConfirmation;
