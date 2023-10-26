import React, { useEffect, useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
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

    const [isFacilityDetailsOpen, setIsFacilityDetailsOpen] = useState(true);
    const [isAddressOpen, setIsAddressOpen] = useState(false);

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

    const handleDropdownChange = (field: keyof FormData, value: string, callback) => {
        // Update the selectedFacilityType with the value
        if (field === 'type') {
            setSelectedFacilityType(value);
        } else if (field === 'createAddressRequest.country_uuid') {
            setSelectedCountry(value);
        }

        callback()
    };

    const handleCancel = () => {
        navigator.navigate('Facilities');
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
        const sanitizedFormData = sanitizeFormData(data);

        facilityService.create(sanitizedFormData).then((response) => {
            navigator.navigate(Screens.facilities);
        }).catch((error) => {
            console.log(error);
        });
    };

    return (
        <ScrollView >
            <View style={styles.container}>
                <Formik
                    validationSchema={formDataValidateSchema}
                    initialValues={initialFormDataValues}
                    initialTouched={initialTouched}
                    onSubmit={values => handleSubmit(values)}
                >
                    {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                        isValid,
                        setFieldValue
                    }) => (
                        <>
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
                                            value={values.name}
                                            onChangeText={handleChange('name')}
                                            placeholder="Name"
                                            placeholderTextColor={placeHolderTextColor}
                                            style={styles.input}
                                        />
                                    </View>
                                    {touched.name && errors.name &&
                                        <Text style={{ fontSize: 14, color: 'red' }}>{errors.name}</Text>
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
                                                handleDropdownChange('type', text, () => {
                                                    setFieldValue('type', text)
                                                })
                                            }}
                                            style={styles.dropDown}
                                        />
                                    </View>
                                    {touched.type && errors.type &&
                                        <Text style={{ fontSize: 14, color: 'red' }}>{errors.type}</Text>
                                    }

                                    <View>
                                        <Text style={styles.label}>Length (in Meters)</Text>
                                        <TextInput
                                            value={values.details.length}
                                            onChangeText={handleChange('details.length')}
                                            placeholder="Length (in Meters)"
                                            placeholderTextColor={placeHolderTextColor}
                                            style={styles.input}
                                        />
                                    </View>
                                    {touched.details?.length && errors.details?.length &&
                                        <Text style={{ fontSize: 14, color: 'red' }}>{errors.details.length}</Text>
                                    }

                                    <View>
                                        <Text style={styles.label}>Width (in Meters)</Text>
                                        <TextInput
                                            value={values.details.width}
                                            onChangeText={handleChange('details.width')}
                                            placeholder="Width (in Meters)"
                                            placeholderTextColor={placeHolderTextColor}
                                            style={styles.input}
                                        />
                                    </View>
                                    {touched.details?.width && errors.details?.width &&
                                        <Text style={{ fontSize: 14, color: 'red' }}>{errors.details.width}</Text>
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
                                            value={values.createAddressRequest.line_1}
                                            onChangeText={handleChange('createAddressRequest.line_1')}
                                            placeholder="Line 1"
                                            placeholderTextColor={placeHolderTextColor}
                                            style={styles.input}
                                        />
                                    </View>
                                    {touched.createAddressRequest?.line_1 && errors.createAddressRequest?.line_1 &&
                                        <Text style={{ fontSize: 14, color: 'red' }}>{errors.createAddressRequest.line_1}</Text>
                                    }

                                    <View>
                                        <Text style={styles.label}>Line 2</Text>
                                        <TextInput
                                            value={values.createAddressRequest.line_2}
                                            onChangeText={handleChange('createAddressRequest.line_2')}
                                            placeholder="Line 2"
                                            placeholderTextColor={placeHolderTextColor}
                                            style={styles.input}
                                        />
                                    </View>

                                    <View>
                                        <Text style={styles.label}>Line 3</Text>
                                        <TextInput
                                            value={values.createAddressRequest.line_3}
                                            onChangeText={handleChange('createAddressRequest.line_3')}
                                            placeholder="Line 3"
                                            placeholderTextColor={placeHolderTextColor}
                                            style={styles.input}
                                        />
                                    </View>

                                    <View>
                                        <Text style={styles.label}>City</Text>
                                        <TextInput
                                            value={values.createAddressRequest.city}
                                            onChangeText={handleChange('createAddressRequest.city')}
                                            placeholder="City"
                                            placeholderTextColor={placeHolderTextColor}
                                            style={styles.input}
                                        />
                                    </View>
                                    {touched.createAddressRequest?.city && errors.createAddressRequest?.city &&
                                        <Text style={{ fontSize: 14, color: 'red' }}>{errors.createAddressRequest.city}</Text>
                                    }

                                    <View>
                                        <Text style={styles.label}>Region / State</Text>
                                        <TextInput
                                            value={values.createAddressRequest.region}
                                            onChangeText={handleChange('createAddressRequest.region')}
                                            placeholder="Region / State"
                                            placeholderTextColor={placeHolderTextColor}
                                            style={styles.input}
                                        />
                                    </View>
                                    {touched.createAddressRequest?.region && errors.createAddressRequest?.region &&
                                        <Text style={{ fontSize: 14, color: 'red' }}>{errors.createAddressRequest.region}</Text>
                                    }

                                    <View>
                                        <Text style={styles.label}>Post Code</Text>
                                        <TextInput
                                            value={values.createAddressRequest.postcode}
                                            onChangeText={handleChange('createAddressRequest.postcode')}
                                            placeholder="Post Code"
                                            placeholderTextColor={placeHolderTextColor}
                                            style={styles.input}
                                        />
                                    </View>
                                    {touched.createAddressRequest?.postcode && errors.createAddressRequest?.postcode &&
                                        <Text style={{ fontSize: 14, color: 'red' }}>{errors.createAddressRequest.postcode}</Text>
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
                                                handleDropdownChange('createAddressRequest.country_uuid', text, () => {
                                                    setFieldValue('type', text)
                                                })
                                            }}
                                            style={styles.dropDown}
                                        />
                                    </View>
                                    {touched.createAddressRequest?.country_uuid && errors.createAddressRequest?.country_uuid &&
                                        <Text style={{ fontSize: 14, color: 'red' }}>{errors.createAddressRequest.country_uuid}</Text>
                                    }
                                </>)}
                            <ImagePicker
                                selectedImages={selectedFacilityPhotos}
                                setSelectedImages={setSelectedFacilityPhotos}
                                selectedImagesBase64={values.companyFacilityPhotos}
                                setSelectedImagesBase64={(newPhotos) => {
                                    setFieldValue('companyFacilityPhotos', newPhotos)
                                }}
                            />

                            <View style={styles.buttonContainer}>
                                <View style={styles.buttonWrapper}>
                                    <Button onPress={handleCancel} title="Cancel" titleStyle={{color: 'red'}} buttonStyle={styles.cancelButton}/>
                                </View>
                                <View style={styles.buttonWrapper}>
                                    <Button onPress={handleSubmit} title="Submit" buttonStyle={styles.submitButton} />
                                </View>
                            </View>
                        </>
                    )}
                </Formik>
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
        marginTop: 10,
        width: '100%',
    },
    submitButton: {
        ...globalStyles.button,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
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
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonWrapper: {
        width: '48%',
    },
});
