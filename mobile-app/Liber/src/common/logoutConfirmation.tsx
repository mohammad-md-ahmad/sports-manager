import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';


const LogoutConfirmation = ({ isVisible, onLogout, onCancel }) => {
    return (
        <Modal isVisible={isVisible} style={styles.modal}>
            <View style={styles.container}>
                <Text style={styles.title}>Confirm Logout</Text>
                <Text style={styles.message}>Are you sure you want to logout?</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={onLogout} style={[styles.button, styles.deleteButton]}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onCancel} style={[styles.button, styles.cancelButton]}>
                        <Text style={styles.buttonText}>Cancel</Text>
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
    deleteButton: {
        backgroundColor: 'red',
        marginRight: 8,
    },
    cancelButton: {
        backgroundColor: 'gray',
        marginLeft: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default LogoutConfirmation;
