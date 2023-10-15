import React, { useState } from "react";

import {
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { Button } from "react-native-elements";
import FacilityService from "../../api/FacilityService";
import globalStyles from "../../styles/styles";
import colors from "../../styles/colors";

interface FormData {
    name: string;
    type: string;
    details: {
        length: string;
        width: string;
    };
    createAddressRequest: {
        line_1: string;
        line_2: string;
        line_3: string;
        city: string;
        region: string;
        postcode: string;
        country_uuid: string;
    };
}

export default function FacilityForm(): React.JSX.Element {
    const facilityService = new FacilityService();

    const [formData, setFormData] = useState<FormData>({
        name: '',
        type: '',
        details: {
            length: '',
            width: '',
        },
        createAddressRequest: {
            line_1: '',
            line_2: '',
            line_3: '',
            city: '',
            region: '',
            postcode: '',
            country_uuid: '',
        },
    });

    const handleInputChange = (field: keyof FormData, value: string) => {
        if (field.startsWith('details.') || field.startsWith('createAddressRequest.')) {
            // Handle nested objects
            const [parentField, nestedField] = field.split('.');
            setFormData({
                ...formData,
                [parentField]: {
                    ...formData[parentField],
                    [nestedField]: value,
                },
            });
        } else {
            setFormData({ ...formData, [field]: value });
        }
    };

    const handleSubmit = () => {
        facilityService.create(formData).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    };

    return (
        <ScrollView >
            <View style={styles.container}>
                <TextInput
                    value={formData.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                    placeholder="Name"
                    placeholderTextColor={colors.PrimaryBlueLight}
                    style={styles.input}
                />
                <TextInput
                    value={formData.type}
                    onChangeText={(text) => handleInputChange('type', text)}
                    placeholder="Type"
                    placeholderTextColor={colors.PrimaryBlueLight}
                    style={styles.input}
                />
                <TextInput
                    value={formData.details.length}
                    onChangeText={(text) => handleInputChange('details.length', text)}
                    placeholder="Length (in Meters)"
                    placeholderTextColor={colors.PrimaryBlueLight}
                    style={styles.input}
                />
                <TextInput
                    value={formData.details.width}
                    onChangeText={(text) => handleInputChange('details.width', text)}
                    placeholder="Width (in Meters)"
                    placeholderTextColor={colors.PrimaryBlueLight}
                    style={styles.input}
                />
                <TextInput
                    value={formData.createAddressRequest.line_1}
                    onChangeText={(text) => handleInputChange('createAddressRequest.line_1', text)}
                    placeholder="Line 1"
                    placeholderTextColor={colors.PrimaryBlueLight}
                    style={styles.input}
                />
                <TextInput
                    value={formData.createAddressRequest.line_2}
                    onChangeText={(text) => handleInputChange('createAddressRequest.line_2', text)}
                    placeholder="Line 2"
                    placeholderTextColor={colors.PrimaryBlueLight}
                    style={styles.input}
                />
                <TextInput
                    value={formData.createAddressRequest.line_3}
                    onChangeText={(text) => handleInputChange('createAddressRequest.line_3', text)}
                    placeholder="Line 3"
                    placeholderTextColor={colors.PrimaryBlueLight}
                    style={styles.input}
                />
                <TextInput
                    value={formData.createAddressRequest.city}
                    onChangeText={(text) => handleInputChange('createAddressRequest.city', text)}
                    placeholder="City"
                    placeholderTextColor={colors.PrimaryBlueLight}
                    style={styles.input}
                />
                <TextInput
                    value={formData.createAddressRequest.region}
                    onChangeText={(text) => handleInputChange('createAddressRequest.region', text)}
                    placeholder="Region / State"
                    placeholderTextColor={colors.PrimaryBlueLight}
                    style={styles.input}
                />
                <TextInput
                    value={formData.createAddressRequest.postcode}
                    onChangeText={(text) => handleInputChange('createAddressRequest.postcode', text)}
                    placeholder="Post Code"
                    placeholderTextColor={colors.PrimaryBlueLight}
                    style={styles.input}
                />
                <TextInput
                    value={formData.createAddressRequest.country_uuid}
                    onChangeText={(text) => handleInputChange('createAddressRequest.country_uuid', text)}
                    placeholder="Country"
                    placeholderTextColor={colors.PrimaryBlueLight}
                    style={styles.input}
                />
                <Button onPress={handleSubmit} title="Submit" buttonStyle={styles.button} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    button: {
        ...globalStyles.button,
        width: '100%'
    },
    input: {
        ...globalStyles.inputText,
        // backgroundColor: 'transparent',
        // borderColor: 'dodgerblue',
        // borderWidth: 1,
        // borderRadius: 5,
        // marginBottom: 10,
        // paddingLeft: 10,
    },
});
