import React, { useEffect, useState } from "react";

import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    TextInput,
    VirtualizedList,
    TouchableOpacity,
} from "react-native";
import globalStyles, { placeHolderTextColor } from "../../styles/styles";
import colors from "../../styles/colors";
import { Button } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";
import { getCountries } from "../../helpers/countriesDataManage";
import { getFacilityTypes } from "../../helpers/facilityTypesDataManage";
import CompanyCard from "../common/companyCard";
import CompanyService from "../../api/CompanyService";
import { getSports } from "../../helpers/sportsDataManage";

export default function Search(): React.JSX.Element {
    const companyService = new CompanyService();

    const [formData, setFormData] = useState({
        name: null,
        city: null,
        country_uuid: null,
        type: null,
        sport_uuid: null,
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const [facilityTypes, setFacilityTypes] = useState([]);

    const [countries, setCountries] = useState([]);
    const [sports, setSports] = useState([]);

    const [selectedFacilityType, setSelectedFacilityType] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [selectedSport, setSelectedSport] = useState<string>('');

    const [facilities, setFacilities] = useState([]);

    const [isFormOpen, setIsFormOpen] = useState(true);

    const getItem = (_data: unknown, index: number) => facilities[index];
    const getItemCount = (_data: unknown) => facilities.length;

    const handleFacilityTypeDropdownChange = (callback) => {
        setSelectedFacilityType(callback(selectedFacilityType));

        setFormData({
            ...formData,
            type: callback(formData.type),
        });
    };

    const handleSportDropdownChange = (callback) => {
        setSelectedSport(callback(selectedSport));

        setFormData({
            ...formData,
            sport_uuid: callback(formData.sport_uuid),
        });
    };

    const handleCountryDropdownChange = (callback) => {
        setSelectedCountry(callback(selectedCountry));

        setFormData({
            ...formData,
            country_uuid: callback(formData.country_uuid),
        });
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
        setIsFormOpen(false);

        companyService.list(sanitizeFormData(formData)).then((response) => {
            setFacilities(response.data?.data.data);
        }).catch((error) => {
            console.error(error);
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

    useEffect(() => {
        getSports().then((response) => {
            if (response) {
                const json: any[] = JSON.parse(response);

                let data = [];

                json.forEach((item) => {
                    data.push({
                        label: item?.name,
                        value: item?.uuid,
                    });
                });

                setSports(data);
            }
        })
    }, []);

    const toggleFormOpen = () => {
        setIsFormOpen(!isFormOpen);
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

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.formContainer}>

                <View>
                    <TextInput
                        placeholder="Company Name"
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
                                open={openDropdown == "selectedCountry"}
                                value={selectedCountry}
                                items={countries}
                                onPress={() => handleOpen("selectedCountry")}
                                onClose={handleClose}
                                setValue={(callback) => handleCountryDropdownChange(callback)}
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
                                open={openDropdown == "selectedFacilityType"}
                                value={selectedFacilityType}
                                items={facilityTypes}
                                onPress={() => handleOpen("selectedFacilityType")}
                                onClose={handleClose}
                                setValue={(callback) => handleFacilityTypeDropdownChange(callback)}
                                style={styles.dropDown}
                            />
                        </View>

                        <View>
                            <DropDownPicker
                                textStyle={{ color: colors.PrimaryBlue }}
                                placeholder="Select Facility Sport"
                                placeholderStyle={{ color: colors.PrimaryBlue }}
                                open={openDropdown == "selectedSport"}
                                value={selectedSport}
                                items={sports}
                                onPress={() => handleOpen("selectedSport")}
                                onClose={handleClose}
                                setValue={(callback) => handleSportDropdownChange(callback)}
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
                renderItem={({ item }) => <CompanyCard company={item} />}
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
