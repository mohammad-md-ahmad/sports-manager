import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';

const PaymentMethodsForm = () => {
    const [selectedMethods, setSelectedMethods] = useState([]);

    const paymentMethods = [
        { uuid: '1', name: 'Credit Card' },
        { uuid: '2', name: 'PayPal' },
        { uuid: '3', name: 'Apple Pay' }];

    const handleToggleMethod = (method) => {
        const updatedMethods = [...selectedMethods];

        if (updatedMethods.includes(method)) {
            // If method is already selected, remove it
            const index = updatedMethods.indexOf(method);
            updatedMethods.splice(index, 1);
        } else {
            // If method is not selected, add it
            updatedMethods.push(method);
        }

        setSelectedMethods(updatedMethods);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Payment Methods</Text>
            {paymentMethods.map((method) => (
                <TouchableOpacity
                    key={method.uuid}
                    style={styles.methodItem}
                    onPress={() => handleToggleMethod(method.uuid)}
                >
                    <CheckBox
                        value={selectedMethods.includes(method.uuid)}
                        onValueChange={() => handleToggleMethod(method.uuid)}
                    />
                    <Text style={styles.methodText}>{method.name}</Text>
                </TouchableOpacity>
            ))}
            {selectedMethods.length > 0 && (
                <Text style={styles.selectedMethodsText}>
                    Selected Methods: {selectedMethods.join(', ')}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    methodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    methodText: {
        fontSize: 16,
        marginLeft: 8,
    },
    selectedMethodsText: {
        marginTop: 16,
        fontSize: 16,
    },
});

export default PaymentMethodsForm;