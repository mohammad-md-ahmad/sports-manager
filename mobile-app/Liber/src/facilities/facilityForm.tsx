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
import { FormMode, Screens } from "../../helpers/constants";
import { imageUrlToBase64 } from "../../helpers/functions";

interface FormData {
    name: string;
    type: string;
    details: {
        length: string;
        width: string;
    };
    address: {
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

export default function FacilityForm({ route, navigation }): React.JSX.Element {
    const navigator = useNavigation();
    const { formModeParam, facilityParam } = route.params;
    const facilityService = new FacilityService();

    const formDataValidateSchema = yupObject().shape({
        name: string().required('Name is required'),
        type: string().required('Type is required'),
        // details: yupObject().shape({
        //     length: string().required('Length is required'),
        //     width: string().required('Width is required'),
        // }),
        address: yupObject().shape({
            line_1: string().required('Line 1 is required'),
            // line_2: string(),
            // line_3: string(),
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
        address: {
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
        address: {
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

    const [facilityTypes, setFacilityTypes] = useState([]);

    const [countries, setCountries] = useState([]);

    const [selectedFacilityType, setSelectedFacilityType] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<string>('');

    const [selectedFacilityPhotos, setSelectedFacilityPhotos] = useState<Array<string>>([]);
    const [selectedFacilityPhotosBase64, setSelectedFacilityPhotosBase64] = useState<Array<string>>([]);

    const [isFacilityDetailsOpen, setIsFacilityDetailsOpen] = useState(true);
    const [isAddressOpen, setIsAddressOpen] = useState(false);

    const [formMode, setFormModeState] = useState(formModeParam ?? FormMode.Add);
    const [facility, setFacility] = useState(facilityParam ?? null);
    const [facilityLoaded, setFacilityLoaded] = useState(false);
    const [facilityHasPhotos, setfacilityHasPhotos] = useState(false);

    const formik = useFormik({
        validationSchema: formDataValidateSchema,
        initialValues: initialFormDataValues,
        initialTouched: initialTouched,
        onSubmit: async (values) => {
            try {
                console.log('validating');
                // Validate the form values using the validation schema
                await formDataValidateSchema.validate(values, { abortEarly: false });

                // If validation succeeds, you can proceed with your submit logic
                handleSubmit(values);
            } catch (errors) {
                // If validation fails, log the errors to the console
                console.error('Form validation errors:', errors);
            }
        }
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
        });

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
        });

        if (formMode == FormMode.Edit) {
            loadFacilityData();
        }
    }, [formModeParam]);

    const handleDropdownChange = (field: keyof FormData, value: string) => {
        if (field === 'type') {
            setSelectedFacilityType(value);
            formik.setFieldValue('type', value());
        } else if (field === 'address.country_uuid') {
            setSelectedCountry(value);
            formik.setFieldValue('address.country_uuid', value());
        }
    };

    const handleImagesChange = (newPhotos) => {
        setSelectedFacilityPhotosBase64(newPhotos);
        formik.handleChange('companyFacilityPhotos', newPhotos)
    }

    const handleCancel = () => {
        navigator.navigate(Screens.Facilities);
    };

    const loadFacilityData = async () => {
        const data = facility;

        mapObjects(initialFormDataValues, data);
        formik.setValues(initialFormDataValues);
        setSelectedFacilityType(data?.type);
        setSelectedCountry(data?.address?.country?.uuid);

        setfacilityHasPhotos(data?.gallery?.length > 0);
        console.log('data', data);
        console.log('data?.gallery?.length > 0 => ', data?.gallery?.length > 0);

        let galleryBase64 = [];

        await Promise.all(
            data?.gallery.map(async function (item) {
                console.log('item', item);
                let imageBase64 = await imageUrlToBase64(item?.image);
                console.log('imageBase64', imageBase64);
                galleryBase64.push(imageBase64);
            })
        );

        console.log('galleryBase64', galleryBase64);

        setSelectedFacilityPhotosBase64(galleryBase64);
        setSelectedFacilityPhotos(galleryBase64);
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

    const createFacility = (data) => {
        facilityService.create(data).then((response) => {
            navigator.navigate(Screens.Facilities);
        }).catch((error) => {
            console.log(error);
        });
    }

    const updateFacility = (data) => {
        console.log('updating facility');
        data.uuid = facility?.uuid;

        facilityService.update(data).then((response) => {
            navigator.navigate(Screens.Facilities);
        }).catch((error) => {
            console.log(error);
        });
    }

    const mapObjects = (target, source) => {
        for (let key in target) {
            if (source.hasOwnProperty(key)) {
                if (typeof target[key] === 'object' && typeof source[key] === 'object') {
                    mapObjects(target[key], source[key]); // Recursively map nested objects
                } else {
                    target[key] = source[key];
                }
            }
        }
    }

    const handleSubmit = (data) => {
        let sanitizedFormData = data;
        sanitizedFormData.companyFacilityPhotos = selectedFacilityPhotosBase64;

        if (formMode == FormMode.Edit) {
            console.log('formik errors', formik.errors);
            updateFacility(sanitizedFormData);
        } else {
            createFacility(sanitizedFormData);
        }
    };

    const [openDropdown, setOpenDropdown] = useState(null);

    const handleOpen = (dropdownId) => {
        // Close any open dropdowns
        setOpenDropdown(dropdownId);
    };

    const handleClose = () => {
        // Close the currently open dropdown
        setOpenDropdown(null);
    };

    const handleRemoveGalleryPhoto = (remainingPhotos) => {
        if (remainingPhotos?.length <= 0) {
            setfacilityHasPhotos(false);
        }
    };

    if (formMode == FormMode.Edit && (selectedFacilityPhotos.length <= 0 && facilityHasPhotos)) {
        return (
            <>
                <Text>Loading gallery photos...</Text>
            </>
        );
    }

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
                            <DropDownPicker
                                textStyle={{ color: colors.PrimaryBlue }}
                                placeholder="Select Facility Type"
                                placeholderStyle={{ color: colors.PrimaryBlue }}
                                open={openDropdown == "selectedFacilityType"}
                                value={selectedFacilityType}
                                items={facilityTypes}
                                onPress={() => handleOpen("selectedFacilityType")}
                                onClose={handleClose}
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
                            <TextInput
                                value={formik.values.address.line_1}
                                onChangeText={formik.handleChange('address.line_1')}
                                placeholder="Line 1"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.input}
                            />
                        </View>
                        {formik.touched.address?.line_1 && formik.errors.address?.line_1 &&
                            <Text style={{ fontSize: 14, color: 'red' }}>{formik.errors.address.line_1}</Text>
                        }

                        <View>
                            <TextInput
                                value={formik.values.address.line_2}
                                onChangeText={formik.handleChange('address.line_2')}
                                placeholder="Line 2"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.input}
                            />
                        </View>

                        <View>
                            <TextInput
                                value={formik.values.address.line_3}
                                onChangeText={formik.handleChange('address.line_3')}
                                placeholder="Line 3"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.input}
                            />
                        </View>

                        <View>
                            <TextInput
                                value={formik.values.address.city}
                                onChangeText={formik.handleChange('address.city')}
                                placeholder="City"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.input}
                            />
                        </View>
                        {formik.touched.address?.city && formik.errors.address?.city &&
                            <Text style={{ fontSize: 14, color: 'red' }}>{formik.errors.address.city}</Text>
                        }

                        <View>
                            <TextInput
                                value={formik.values.address.region}
                                onChangeText={formik.handleChange('address.region')}
                                placeholder="Region / State"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.input}
                            />
                        </View>
                        {formik.touched.address?.region && formik.errors.address?.region &&
                            <Text style={{ fontSize: 14, color: 'red' }}>{formik.errors.address.region}</Text>
                        }

                        <View>
                            <TextInput
                                value={formik.values.address.postcode}
                                onChangeText={formik.handleChange('address.postcode')}
                                placeholder="Post Code"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.input}
                            />
                        </View>
                        {formik.touched.address?.postcode && formik.errors.address?.postcode &&
                            <Text style={{ fontSize: 14, color: 'red' }}>{formik.errors.address.postcode}</Text>
                        }

                        <View>
                            <DropDownPicker
                                textStyle={{ color: colors.PrimaryBlue }}
                                placeholder="Select Country"
                                placeholderStyle={{ color: colors.PrimaryBlue }}
                                open={openDropdown == "selectedCountry"}
                                value={selectedCountry}
                                items={countries}
                                onPress={() => handleOpen("selectedCountry")}
                                onClose={handleClose}
                                setValue={(text: any) => {
                                    handleDropdownChange('address.country_uuid', text)
                                }}
                                style={styles.dropDown}
                            />
                        </View>
                        {formik.touched.address?.country_uuid && formik.errors.address?.country_uuid &&
                            <Text style={{ fontSize: 14, color: 'red' }}>{formik.errors.address.country_uuid}</Text>
                        }
                    </>)}

                <ImagePicker
                    selectedImages={selectedFacilityPhotos}
                    setSelectedImages={setSelectedFacilityPhotos}
                    selectedImagesBase64={formik.values.companyFacilityPhotos}
                    setSelectedImagesBase64={(newPhotos) => handleImagesChange(newPhotos)}
                    handleRemoveGalleryPhoto={handleRemoveGalleryPhoto}
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
    },
    dropDown: {
        ...globalStyles.inputText,
        marginBottom: 10,
    },
    label: {
        ...globalStyles.inputTextLabel
    },
    cancelButton: {
        ...globalStyles.button,
        color: 'red',
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 50,
        marginTop: 0,
        width: '100%',
    },
    submitButton: {
        ...globalStyles.button,
        padding: 10,
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
