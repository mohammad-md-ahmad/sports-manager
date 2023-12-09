import React, { useEffect, useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { Formik, useFormik } from "formik";
import { ScrollView, TextInput, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { string, array, object as yupObject } from "yup";
import FacilityService from "../../api/FacilityService";
import globalStyles, { placeHolderTextColor } from "../../styles/styles";
import DropDownPicker from "react-native-dropdown-picker";
import colors from "../../styles/colors";
import { getFacilityTypes } from "../../helpers/facilityTypesDataManage";
import { getCountries } from "../../helpers/countriesDataManage";
import ImagePicker from "../common/imagePicker";
import { Button } from "react-native-elements";
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

    const formDataValidateSchema = yupObject().shape({
        name: string().required('Name is required'),
        type: string().required('Type is required'),
        details: yupObject().shape({
            length: string().required('Length is required'),
            width: string().required('Width is required'),
        }),
        createAddressRequest: yupObject().shape({
            line_1: string().required('Line 1 is required'),
            line_2: string(),
            line_3: string(),
            city: string().required('City is required'),
            region: string().required('Region is required'),
            postcode: string().required('Postcode is required'),
            country_uuid: string().required('Country UUID is required'),
            geocode_data: yupObject().shape({
                lat: string().required('Latitude is required'),
                lng: string().required('Longitude is required'),
            }),
        }),
        companyFacilityPhotos: array(),
    });

    const initialFormDataValues = {
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
    };

    const initialTouched = {
        name: false,
        type: false,
        details: {
            length: false,
            width: false,
        },
        createAddressRequest: {
            line_1: false,
            line_2: false,
            line_3: false,
            city: false,
            region: false,
            postcode: false,
            country_uuid: false,
            geocode_data: {
                lat: false,
                lng: false,
            },
        },
        companyFacilityPhotos: false,
    };

    const [openFacilityTypeList, setOpenFacilityTypeList] = useState(false);
    const [facilityTypes, setFacilityTypes] = useState([]);

    const [openCountryList, setOpenCountryList] = useState(false);
    const [countries, setCountries] = useState([]);

    const [selectedFacilityType, setSelectedFacilityType] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<string>('');

    const [selectedFacilityPhotos, setSelectedFacilityPhotos] = useState<Array<string>>([]);
    const [selectedFacilityPhotosBase64, setSelectedFacilityPhotosBase64] = useState<Array<string>>([]);

    const [isFacilityDetailsOpen, setIsFacilityDetailsOpen] = useState(true);
    const [isAddressOpen, setIsAddressOpen] = useState(false);

    const formik = useFormik({
        validationSchema: formDataValidateSchema,
        initialValues: initialFormDataValues,
        initialTouched: initialTouched,
        onSubmit: (values) => handleSubmit(values)
    });

    const toggleFacilityDetails = () => {
        setIsFacilityDetailsOpen(!isFacilityDetailsOpen);
    };

    const toggleAddress = () => {
        setIsAddressOpen(!isAddressOpen);
    };

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

    const handleDropdownChange = (field: keyof FormData, value: string) => {
        if (field === 'type') {
            setSelectedFacilityType(value);
            formik.setFieldValue('type', value());
        } else if (field === 'createAddressRequest.country_uuid') {
            setSelectedCountry(value);
            formik.setFieldValue('createAddressRequest.country_uuid', value());
        }
    };

    const handleImagesChange = (newPhotos) => {
        setSelectedFacilityPhotosBase64(newPhotos);
        formik.handleChange('companyFacilityPhotos', newPhotos)
    }

    const handleCancel = () => {
        navigator.navigate(Screens.Facilities);
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

    const handleSubmit = (data) => {
        let sanitizedFormData = data;
        console.log(selectedFacilityPhotosBase64);
        sanitizedFormData.companyFacilityPhotos = selectedFacilityPhotosBase64;

        facilityService.create(sanitizedFormData).then((response) => {
            navigator.navigate(Screens.Facilities);
        }).catch((error) => {
            console.log('the error', error.response.data);
        });
    };

    return (
        <ScrollView >
            <View style={styles.container}>
                {/* Facility Details Section */}
                <TouchableOpacity style={styles.section} onPress={toggleFacilityDetails}>
                    <Text style={styles.sectionTitle}>
                        {isFacilityDetailsOpen ? '▼' : '▶'} Facility Details
                    </Text>
                </TouchableOpacity>
                {isFacilityDetailsOpen && (
                    <>
                        <View>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                value={formik.values.name}
                                onChangeText={formik.handleChange('name')}
                                placeholder="Name"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.input}
                            />
                        </View>
                        {formik.touched.name && formik.errors.name &&
                            <Text style={{ fontSize: 14, color: 'red' }}>{formik.errors.name}</Text>
                        }

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
                                setValue={(text: any) => {
                                    handleDropdownChange('type', text)
                                }}
                                style={styles.dropDown}
                            />
                        </View>
                        {formik.touched.type && formik.errors.type &&
                            <Text style={{ fontSize: 14, color: 'red' }}>{formik.errors.type}</Text>
                        }

                        <View>
                            <Text style={styles.label}>Length (in Meters)</Text>
                            <TextInput
                                value={formik.values.details.length}
                                onChangeText={formik.handleChange('details.length')}
                                placeholder="Length (in Meters)"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.input}
                            />
                        </View>
                        {formik.touched.details?.length && formik.errors.details?.length &&
                            <Text style={{ fontSize: 14, color: 'red' }}>{formik.errors.details.length}</Text>
                        }

                        <View>
                            <Text style={styles.label}>Width (in Meters)</Text>
                            <TextInput
                                value={formik.values.details.width}
                                onChangeText={formik.handleChange('details.width')}
                                placeholder="Width (in Meters)"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.input}
                            />
                        </View>
                        {formik.touched.details?.width && formik.errors.details?.width &&
                            <Text style={{ fontSize: 14, color: 'red' }}>{formik.errors.details.width}</Text>
                        }
                    </>)}
                {/* Address Section */}
                <TouchableOpacity style={styles.section} onPress={toggleAddress}>
                    <Text style={styles.sectionTitle}>
                        {isAddressOpen ? '▼' : '▶'} Address
                    </Text>
                </TouchableOpacity>
                {isAddressOpen && (
                    <>
                        <View>
                            <Text style={styles.label}>Line 1</Text>
                            <TextInput
                                value={formik.values.createAddressRequest.line_1}
                                onChangeText={formik.handleChange('createAddressRequest.line_1')}
                                placeholder="Line 1"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.input}
                            />
                        </View>
                        {formik.touched.createAddressRequest?.line_1 && formik.errors.createAddressRequest?.line_1 &&
                            <Text style={{ fontSize: 14, color: 'red' }}>{formik.errors.createAddressRequest.line_1}</Text>
                        }

                        <View>
                            <Text style={styles.label}>Line 2</Text>
                            <TextInput
                                value={formik.values.createAddressRequest.line_2}
                                onChangeText={formik.handleChange('createAddressRequest.line_2')}
                                placeholder="Line 2"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.input}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Line 3</Text>
                            <TextInput
                                value={formik.values.createAddressRequest.line_3}
                                onChangeText={formik.handleChange('createAddressRequest.line_3')}
                                placeholder="Line 3"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.input}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>City</Text>
                            <TextInput
                                value={formik.values.createAddressRequest.city}
                                onChangeText={formik.handleChange('createAddressRequest.city')}
                                placeholder="City"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.input}
                            />
                        </View>
                        {formik.touched.createAddressRequest?.city && formik.errors.createAddressRequest?.city &&
                            <Text style={{ fontSize: 14, color: 'red' }}>{formik.errors.createAddressRequest.city}</Text>
                        }

                        <View>
                            <Text style={styles.label}>Region / State</Text>
                            <TextInput
                                value={formik.values.createAddressRequest.region}
                                onChangeText={formik.handleChange('createAddressRequest.region')}
                                placeholder="Region / State"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.input}
                            />
                        </View>
                        {formik.touched.createAddressRequest?.region && formik.errors.createAddressRequest?.region &&
                            <Text style={{ fontSize: 14, color: 'red' }}>{formik.errors.createAddressRequest.region}</Text>
                        }

                        <View>
                            <Text style={styles.label}>Post Code</Text>
                            <TextInput
                                value={formik.values.createAddressRequest.postcode}
                                onChangeText={formik.handleChange('createAddressRequest.postcode')}
                                placeholder="Post Code"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.input}
                            />
                        </View>
                        {formik.touched.createAddressRequest?.postcode && formik.errors.createAddressRequest?.postcode &&
                            <Text style={{ fontSize: 14, color: 'red' }}>{formik.errors.createAddressRequest.postcode}</Text>
                        }

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
                                setValue={(text: any) => {
                                    handleDropdownChange('createAddressRequest.country_uuid', text)
                                }}
                                style={styles.dropDown}
                            />
                        </View>
                        {formik.touched.createAddressRequest?.country_uuid && formik.errors.createAddressRequest?.country_uuid &&
                            <Text style={{ fontSize: 14, color: 'red' }}>{formik.errors.createAddressRequest.country_uuid}</Text>
                        }
                    </>)}
                <ImagePicker
                    selectedImages={selectedFacilityPhotos}
                    setSelectedImages={setSelectedFacilityPhotos}
                    selectedImagesBase64={formik.values.companyFacilityPhotos}
                    setSelectedImagesBase64={(newPhotos) => handleImagesChange(newPhotos)}
                />

                <View style={styles.buttonContainer}>
                    <View style={styles.buttonWrapper}>
                        <Button onPress={handleCancel} title="Cancel" titleStyle={{ color: 'red' }} buttonStyle={styles.cancelButton} />
                    </View>
                    <View style={styles.buttonWrapper}>
                        <Button onPress={formik.handleSubmit} title="Submit" buttonStyle={styles.submitButton} />
                    </View>
                </View>
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
        flex: 1,
        width: '100%',
        padding: 0
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
    cancelButton: {
        color: 'red',
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 5,
        marginTop: 0,
        width: '100%',
    },
    submitButton: {
        ...globalStyles.button,
        padding: 10,
        borderRadius: 5,
        marginTop: 0,
        width: '100%',
    },
    section: {
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        color: colors.PrimaryBlue,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    buttonWrapper: {
        width: '48%',
    },
});
