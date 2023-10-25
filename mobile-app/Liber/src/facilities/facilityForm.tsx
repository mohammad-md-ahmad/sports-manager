import React, { useEffect, useState } from "react";

import {
    ScrollView,
    StyleSheet,
    Text,
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
import { getCountries } from "../../helpers/countriesDataManage";
import { useNavigation } from "@react-navigation/native";
import ImagePicker from "../common/imagePicker";
import { Screens } from "../../helpers/constants";

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
    companyFacilityPhotos: Array<string>;
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
        companyFacilityPhotos: [],
    });

    const [openFacilityTypeList, setOpenFacilityTypeList] = useState(false);
    const [facilityTypes, setFacilityTypes] = useState([]);

    const [openCountryList, setOpenCountryList] = useState(false);
    const [countries, setCountries] = useState([]);

    const [selectedFacilityType, setSelectedFacilityType] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<string>('');

    const [selectedFacilityPhotos, setSelectedFacilityPhotos] = useState<Array<string>>([]);

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

    const setFacilityPhotosBase64 = (newPhotos) => {
        console.log('newPhotos base64', newPhotos);
        setFormData((prevData) => ({
            ...prevData,
            companyFacilityPhotos: newPhotos,
        }));

        console.log('companyFacilityPhotos base64', formData.companyFacilityPhotos);
    }

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
            setTimeout(() => {
                navigator.navigate(Screens.facilities);
            }, 2000); // sleep for 2 secs
        }).catch((error) => {
            console.log(error);
        });
    };

    return (
        <ScrollView >
            <View style={styles.container}>
                <View>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        value={formData.name}
                        onChangeText={(text) => handleInputChange('name', text)}
                        placeholder="Name"
                        placeholderTextColor={placeHolderTextColor}
                        style={styles.input}
                    />
                </View>

                <View>
                    <Text style={styles.label}>Facility Type</Text>
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
                </View>

                <View>
                    <Text style={styles.label}>Length (in Meters)</Text>
                    <TextInput
                        value={formData.details.length}
                        onChangeText={(text) => handleInputChange('details.length', text)}
                        placeholder="Length (in Meters)"
                        placeholderTextColor={placeHolderTextColor}
                        style={styles.input}
                    />
                </View>

                <View>
                    <Text style={styles.label}>Width (in Meters)</Text>
                    <TextInput
                        value={formData.details.width}
                        onChangeText={(text) => handleInputChange('details.width', text)}
                        placeholder="Width (in Meters)"
                        placeholderTextColor={placeHolderTextColor}
                        style={styles.input}
                    />
                </View>

                <View>
                    <Text style={styles.label}>Line 1</Text>
                    <TextInput
                        value={formData.createAddressRequest.line_1}
                        onChangeText={(text) => handleInputChange('createAddressRequest.line_1', text)}
                        placeholder="Line 1"
                        placeholderTextColor={placeHolderTextColor}
                        style={styles.input}
                    />
                </View>

                <View>
                    <Text style={styles.label}>Line 2</Text>
                    <TextInput
                        value={formData.createAddressRequest.line_2}
                        onChangeText={(text) => handleInputChange('createAddressRequest.line_2', text)}
                        placeholder="Line 2"
                        placeholderTextColor={placeHolderTextColor}
                        style={styles.input}
                    />
                </View>

                <View>
                    <Text style={styles.label}>Line 3</Text>
                    <TextInput
                        value={formData.createAddressRequest.line_3}
                        onChangeText={(text) => handleInputChange('createAddressRequest.line_3', text)}
                        placeholder="Line 3"
                        placeholderTextColor={placeHolderTextColor}
                        style={styles.input}
                    />
                </View>

                <View>
                    <Text style={styles.label}>City</Text>
                    <TextInput
                        value={formData.createAddressRequest.city}
                        onChangeText={(text) => handleInputChange('createAddressRequest.city', text)}
                        placeholder="City"
                        placeholderTextColor={placeHolderTextColor}
                        style={styles.input}
                    />
                </View>

                <View>
                    <Text style={styles.label}>Region / State</Text>
                    <TextInput
                        value={formData.createAddressRequest.region}
                        onChangeText={(text) => handleInputChange('createAddressRequest.region', text)}
                        placeholder="Region / State"
                        placeholderTextColor={placeHolderTextColor}
                        style={styles.input}
                    />
                </View>

                <View>
                    <Text style={styles.label}>Post Code</Text>
                    <TextInput
                        value={formData.createAddressRequest.postcode}
                        onChangeText={(text) => handleInputChange('createAddressRequest.postcode', text)}
                        placeholder="Post Code"
                        placeholderTextColor={placeHolderTextColor}
                        style={styles.input}
                    />
                </View>

                <View>
                    <Text style={styles.label}>Country</Text>
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
                </View>

                <ImagePicker
                    selectedImages={selectedFacilityPhotos}
                    setSelectedImages={setSelectedFacilityPhotos}
                    selectedImagesBase64={formData.companyFacilityPhotos}
                    setSelectedImagesBase64={setFacilityPhotosBase64}
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
    },
    label: {
        ...globalStyles.inputTextLabel
    },
});
