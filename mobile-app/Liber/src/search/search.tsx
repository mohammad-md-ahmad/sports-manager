import React, { useEffect, useState } from "react";

import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    TextInput,
    VirtualizedList,
    TouchableOpacity
} from "react-native";
import globalStyles, { placeHolderTextColor } from "../../styles/styles";
import colors from "../../styles/colors";
import { Button } from "react-native-elements";
import CompanyService from "../../api/CompanyService";
import DropDownPicker from "react-native-dropdown-picker";
import { getCountries } from "../../helpers/countriesDataManage";
import { getFacilityTypes } from "../../helpers/facilityTypesDataManage";
import FacilityCard from "../common/facilityCard";
import FacilityService from "../../api/FacilityService";

export default function Search(): React.JSX.Element {
    const facilityService = new FacilityService();
    const [formData, setFormData] = useState({
        name: null,
        city: null,
        country_uuid: null,
        type: null
    });


    const handleInputChange = (field: string, value: string) => {
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

    const [openFacilityTypeList, setOpenFacilityTypeList] = useState(false);
    const [facilityTypes, setFacilityTypes] = useState([]);

    const [openCountryList, setOpenCountryList] = useState(false);
    const [countries, setCountries] = useState([]);

    const [selectedFacilityType, setSelectedFacilityType] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<string>('');


    const handleDropdownChange = (field: keyof FormData, value: string) => {
        if (field === 'type') {
            setSelectedFacilityType(value);
        } else if (field === 'country_uuid') {
            setSelectedCountry(value);
        }
        console.log("dd list", value())
        setFormData({ ...formData, [field]: value() });
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


    function onSearchPress(): void {
        console.log('search key', formData)
        // companyService.update(formData).then((response) => {
        //     // Handle a successful API response
        //    // navigator.navigate(Screens.CompanyProfile);
        // })
        //     .catch((error) => {
        //         // Handle API request errors here
        //       //  setErrors(error.response.data.errors)
        //     });

        facilityService.list(sanitizeFormData(formData))
            .then((response) => {
                setFacilities(response.data?.data.data);
            }).catch((error) => {
            });
    }

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

    const [facilities, setFacilities] = useState([]);
    const getItem = (_data: unknown, index: number) => facilities[index];
    const getItemCount = (_data: unknown) => facilities.length;

    const toggleFormOpen = () => {
        setIsFormOpen(!isFormOpen);
    };

    const [isFormOpen, setIsFormOpen] = useState(true);

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.formContainer}>

                <View>
                    <TextInput
                        placeholder="Facility Name"
                        placeholderTextColor={placeHolderTextColor}
                        style={styles.formTextInput}
                        value={formData.name}
                        onChangeText={(text) => handleInputChange('name', text)}
                    />
                </View>

                <TouchableOpacity style={styles.section} onPress={toggleFormOpen}>
                    <Text style={styles.sectionTitle}>
                        {isFormOpen ? '▼' : '▶'} Filters
                    </Text>
                </TouchableOpacity>
                {isFormOpen && (
                    <>


                        <View>
                            <DropDownPicker
                                textStyle={{ color: colors.PrimaryBlue }}
                                placeholder="Select Country"
                                placeholderStyle={{ color: colors.PrimaryBlue }}
                                open={openCountryList}
                                value={selectedCountry}
                                items={countries}
                                setOpen={setOpenCountryList}
                                setValue={(text: any) => {
                                    handleDropdownChange('country_uuid', text)
                                }}
                                style={styles.dropDown}
                            />
                        </View>

                        <View>
                            <TextInput
                                placeholder="City"
                                placeholderTextColor={placeHolderTextColor}
                                style={styles.formTextInput}
                                value={formData.city}
                                onChangeText={(text) => handleInputChange('city', text)}
                            />
                        </View>

                        <View>
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

                    </>
                )}

                <Button
                    onPress={() => onSearchPress()}
                    title="Search"
                    buttonStyle={styles.button}
                />
            </View>

            <VirtualizedList
                initialNumToRender={6}
                renderItem={({ item }) => <FacilityCard facility={item} />}
                keyExtractor={item => item.uuid}
                getItemCount={getItemCount}
                getItem={getItem}
            />
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    containerView: {
    },
    formContainer: {
        padding: 16,
    },
    formView: {
    },
    formTextInput: {
        ...globalStyles.inputText
    },
    button: {
        ...globalStyles.button,
        width: '100%'
    },

    label: {
        ...globalStyles.inputTextLabel
    },
    dropDown: {
        ...globalStyles.inputText,
        marginBottom: 10,
    },
    section: {
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        marginBottom: 10,
    },
    sectionTitle: {
        color: colors.PrimaryBlue,
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
});

