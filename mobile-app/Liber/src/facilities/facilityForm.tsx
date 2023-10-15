import React, { useState } from "react";

import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import globalStyles from "../../styles/styles";
import { Button } from "react-native-elements";

interface FormData {
    name: string;
    type: string;
    length: string;
    width: string;
    line_1: string;
    line_2: string;
    line_3: string;
    city: string;
    region: string;
    postcode: string;
    country: string;
}

export default function FacilityForm(): React.JSX.Element {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        type: '',
        length: '',
        width: '',
        line_1: '',
        line_2: '',
        line_3: '',
        city: '',
        region: '',
        postcode: '',
        country: '',
    });

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = () => {
        // You can handle form submission here
        console.log(formData);
    };

    return (
        <ScrollView style={styles.container}>
            <TextInput
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="Name"
                style={styles.input}
            />
            <TextInput
                value={formData.type}
                onChangeText={(text) => handleInputChange('type', text)}
                placeholder="Type"
                style={styles.input}
            />
            <TextInput
                value={formData.length}
                onChangeText={(text) => handleInputChange('length', text)}
                placeholder="Length (in Meters)"
                style={styles.input}
            />
            <TextInput
                value={formData.width}
                onChangeText={(text) => handleInputChange('width', text)}
                placeholder="Width (in Meters)"
                style={styles.input}
            />
            <TextInput
                value={formData.line_1}
                onChangeText={(text) => handleInputChange('line_1', text)}
                placeholder="Line 1"
                style={styles.input}
            />
            <TextInput
                value={formData.line_2}
                onChangeText={(text) => handleInputChange('line_2', text)}
                placeholder="Line 2"
                style={styles.input}
            />
            <TextInput
                value={formData.line_3}
                onChangeText={(text) => handleInputChange('line_3', text)}
                placeholder="Line 3"
                style={styles.input}
            />
            <TextInput
                value={formData.city}
                onChangeText={(text) => handleInputChange('city', text)}
                placeholder="City"
                style={styles.input}
            />
            <TextInput
                value={formData.region}
                onChangeText={(text) => handleInputChange('region', text)}
                placeholder="Region / State"
                style={styles.input}
            />
            <TextInput
                value={formData.postcode}
                onChangeText={(text) => handleInputChange('postcode', text)}
                placeholder="Post Code"
                style={styles.input}
            />
            <TextInput
                value={formData.country}
                onChangeText={(text) => handleInputChange('country', text)}
                placeholder="Country"
                style={styles.input}
            />
            <Button onPress={handleSubmit} title="Submit" style={styles.button} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    button: {
        backgroundColor: 'dodgerblue',
        borderRadius: 5,
        marginTop: 20,
    },
    input: {
        backgroundColor: 'transparent',
        borderColor: 'dodgerblue',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
    },
});
