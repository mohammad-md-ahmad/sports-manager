import React, { useEffect, useState } from "react";

import {
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { Button } from "react-native-elements";
import FacilityService from "../../api/FacilityService";
import globalStyles from "../../styles/styles";
import { placeHolderTextColor } from "../../styles/styles";
import DropDownPicker from "react-native-dropdown-picker";
import colors from "../../styles/colors";
import { getFacilityTypes } from "../../helpers/facilityTypesDataManage";
import { getCountries } from "../../helpers/CountriesDataManage";
import Snackbar from "react-native-snackbar";
import { useNavigation } from "@react-navigation/native";

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
        geocode_data: {
            lat: string;
            lng: string;
        };
    };
}

export default function FacilityForm(): React.JSX.Element {
    const navigator = useNavigation();

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
            geocode_data: {
                lat: '34',
                lng: '35',
            }
        },
    });

    const [openFacilityTypeList, setOpenFacilityTypeList] = useState(false);
    const [facilityTypes, setFacilityTypes] = useState([]);

    const [openCountryList, setOpenCountryList] = useState(false);
    const [countries, setCountries] = useState([]);

    const [selectedFacilityType, setSelectedFacilityType] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<string>('');

    useEffect(() => {
        getFacilityTypes().then((response) => {
            if (response) {
                const json = JSON.parse(response);

                let data = [];

                Object.keys(json).forEach(function (key) {
                    data.push({
                        label: json[key],
                        value: key,
                    });
                });

                setFacilityTypes(data);
            }
        })
    }, []);

    useEffect(() => {
        getCountries().then((response) => {
            if (response) {
                const json: any[] = JSON.parse(response);

                let data = [];

                json.forEach((item) => {
                    data.push({
                        label: item?.name,
                        value: item?.country_uuid,
                    });
                });

                setCountries(data);
            }
        })
    }, []);

    useEffect(() => {
        setFormData({ ...formData, 'type': selectedFacilityType });
    }, [selectedFacilityType]);

    useEffect(() => {
        setFormData({
            ...formData, createAddressRequest: {
                ...formData.createAddressRequest,
                country_uuid: selectedCountry,
            }
        });
    }, [selectedCountry]);

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

            if (nestedField === 'country_uuid') {
                setSelectedCountry(value);
            }
        } else {
            setFormData({ ...formData, [field]: value });

            // Update the selectedFacilityType with the value
            if (field === 'type') {
                setSelectedFacilityType(value);
            }
        }
    };

    const sanitizeFormData = (data) => {
        const sanitizedData = {};

        for (const key in data) {
            if (data[key] === null || data[key] === '') {
                continue; // Skip null or empty properties
            }
            if (typeof data[key] === 'object') {
                sanitizedData[key] = sanitizeFormData(data[key]); // Recursively sanitize nested objects
            } else {
                sanitizedData[key] = data[key];
            }
        }

        return sanitizedData;
    };

    const handleSubmit = () => {
        const sanitizedFormData = sanitizeFormData(formData);

        facilityService.create(sanitizedFormData).then((response) => {
            Snackbar.show({
                text: 'Facility has been created successfully!',
                duration: 3000
            });

            setTimeout(() => {
                navigator.navigate('Facilities');
            }, 2000); // sleep for 2 secs
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
                    placeholderTextColor={placeHolderTextColor}
                    style={styles.input}
                />
                <DropDownPicker
                    textStyle={{ color: colors.PrimaryBlue }}
                    placeholder="Select Facility Type"
                    placeholderStyle={{ color: colors.PrimaryBlue }}
                    open={openFacilityTypeList}
                    value={selectedFacilityType}
                    items={facilityTypes}
                    setOpen={setOpenFacilityTypeList}
                    setValue={(text: any) => handleInputChange('type', text)}
                    style={styles.dropDown}
                />
                <TextInput
                    value={formData.details.length}
                    onChangeText={(text) => handleInputChange('details.length', text)}
                    placeholder="Length (in Meters)"
                    placeholderTextColor={placeHolderTextColor}
                    style={styles.input}
                />
                <TextInput
                    value={formData.details.width}
                    onChangeText={(text) => handleInputChange('details.width', text)}
                    placeholder="Width (in Meters)"
                    placeholderTextColor={placeHolderTextColor}
                    style={styles.input}
                />
                <TextInput
                    value={formData.createAddressRequest.line_1}
                    onChangeText={(text) => handleInputChange('createAddressRequest.line_1', text)}
                    placeholder="Line 1"
                    placeholderTextColor={placeHolderTextColor}
                    style={styles.input}
                />
                <TextInput
                    value={formData.createAddressRequest.line_2}
                    onChangeText={(text) => handleInputChange('createAddressRequest.line_2', text)}
                    placeholder="Line 2"
                    placeholderTextColor={placeHolderTextColor}
                    style={styles.input}
                />
                <TextInput
                    value={formData.createAddressRequest.line_3}
                    onChangeText={(text) => handleInputChange('createAddressRequest.line_3', text)}
                    placeholder="Line 3"
                    placeholderTextColor={placeHolderTextColor}
                    style={styles.input}
                />
                <TextInput
                    value={formData.createAddressRequest.city}
                    onChangeText={(text) => handleInputChange('createAddressRequest.city', text)}
                    placeholder="City"
                    placeholderTextColor={placeHolderTextColor}
                    style={styles.input}
                />
                <TextInput
                    value={formData.createAddressRequest.region}
                    onChangeText={(text) => handleInputChange('createAddressRequest.region', text)}
                    placeholder="Region / State"
                    placeholderTextColor={placeHolderTextColor}
                    style={styles.input}
                />
                <TextInput
                    value={formData.createAddressRequest.postcode}
                    onChangeText={(text) => handleInputChange('createAddressRequest.postcode', text)}
                    placeholder="Post Code"
                    placeholderTextColor={placeHolderTextColor}
                    style={styles.input}
                />
                <DropDownPicker
                    textStyle={{ color: colors.PrimaryBlue }}
                    placeholder="Select Country"
                    placeholderStyle={{ color: colors.PrimaryBlue }}
                    open={openCountryList}
                    value={selectedCountry}
                    items={countries}
                    setOpen={setOpenCountryList}
                    setValue={(text: any) => handleInputChange('createAddressRequest.country_uuid', text)}
                    style={styles.dropDown}
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
    dropDown: {
        ...globalStyles.inputText,
        marginBottom: 10,
    }
});
