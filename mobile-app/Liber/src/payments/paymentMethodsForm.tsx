import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import CompanyService from '../../api/CompanyService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import globalStyles from '../../styles/styles';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import { Screens } from '../../helpers/constants';

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

    function onSubmitPress(): void {

        let newMethods = paymentMethods.filter(obj =>
            obj.isSelected
        ).map(obj => obj.name);

        companyService.postCompanyList({
            "key": "Payment_methods",
            "value": newMethods
        }).then((response) => {

        }).catch((error) => {
        });

    }

    const navigator = useNavigation();
    const handleCancel = () => {
        navigator.navigate(Screens.ProfileMenu);
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

            <View style={styles.buttonContainer}>
                <View style={styles.buttonWrapper}>
                    <Button onPress={() => handleCancel()} title="Cancel" titleStyle={{ color: 'red' }} buttonStyle={styles.cancelButton} />
                </View>
                <View style={styles.buttonWrapper}>
                    <Button onPress={() => onSubmitPress()} title="Submit" buttonStyle={styles.submitButton} />
                </View>
            </View>
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    buttonWrapper: {
        width: '48%',
    },
    cancelButton: {
        ...globalStyles.button,
        color: 'red',
        backgroundColor: 'transparent',
        padding: 10,
        width: '100%',
        marginTop: 0,
    },
    submitButton: {
        ...globalStyles.button,
        padding: 10,
        width: '100%',
        marginTop: 0,
    },
});

export default PaymentMethodsForm;