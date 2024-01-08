import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';
import CompanyService from '../../api/CompanyService';
import { useFocusEffect } from '@react-navigation/native';
import globalStyles from '../../styles/styles';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const PaymentMethodsForm = () => {
    const [paymentMethods, setPaymentMethods] = useState([]);

    let companyService = new CompanyService();

    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.

            companyService.getCompanyList({
                "key": "Payment_methods"
            }).then((response) => {
                let pMethods = [];
                response.data?.data?.app_list?.Payment_methods.forEach(element => {
                    pMethods.push({
                        name: element,
                        isSelected: response.data?.data?.company_list?.Payment_methods.includes(element)
                    }
                    )
                });
                setPaymentMethods(pMethods);
            }).catch((error) => {
            });

        }, [])
    );

    const handleToggleMethod = (method: any) => {

        let newMethods = paymentMethods.map(obj =>
            obj.name === method.name ? { ...obj, isSelected: !method.isSelected } : obj
        );

        setPaymentMethods(newMethods);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Payment Methods</Text>
            {paymentMethods.map((method) => (
                <TouchableOpacity
                    key={method.name}
                    style={styles.methodItem}
                    onPress={() => handleToggleMethod(method)}
                >
                    <CheckBox
                        checked={method.isSelected}
                        onValueChange={() => handleToggleMethod(method)}
                    />
                    <Text style={styles.methodText}>{method.name}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        ...globalStyles.text,
        color: colors.PrimaryBlue,
        marginBottom: 16,
    },
    methodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    methodText: {
        ...globalStyles.text,
        color: colors.PrimaryBlue,
        fontFamily: fonts.Poppins.regular,
        fontSize: 16,
    },
    selectedMethodsText: {
        marginTop: 16,
        fontSize: 16,
    },
});

export default PaymentMethodsForm;