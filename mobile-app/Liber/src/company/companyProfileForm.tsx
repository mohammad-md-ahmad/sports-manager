import React, { useEffect, useState } from "react";

import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import globalStyles from "../../styles/styles";
import CompanyService from "../../api/CompanyService";
import colors, { placeHolderTextColor } from "../../styles/styles";
import { Button, Icon } from "react-native-elements";
import { launchImageLibrary } from 'react-native-image-picker';
import { getCompanyData } from "../../helpers/companyDataManage";
import Constants from "../../helpers/constants";

interface CompanyFormData {
    uuid: string | null;
    name: string;
    name_ar: string;
    description: string;
    logo: string | null;
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

export default function CompanyProfileForm(): React.JSX.Element {

    let companyService = new CompanyService();

    const [logo, setLogo] = useState(require('./../../assets/images/liber_logo.png'));

    const [formData, setFormData] = useState<CompanyFormData>({
        uuid: null,
        name: '',
        name_ar: '',
        description: '',
        logo: null,
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

    useEffect(() => {

        companyService.getCompany().then((response) => {
            console.log('company data', response.data);
            response.data.data.createAddressRequest = { ...response.data.data.address }
            setFormData({ ...response.data.data, logo: null });
            setLogo({uri: Constants.assetsUrl + '/' + response.data?.data?.logo});
        }).catch((error) => {
            console.error('company error', error)
        });


        // getCompanyData().then((data: string | null) => {
        //     if (data !== null) {
        //         let parsedData = JSON.parse(data);
        //         console.log('parsedData-------', parsedData)

        //         // if (parsedData.logo == null)
        //         //   parsedData.logo = require('./../../assets/images/liber_logo.png');

        //         parsedData.createAddressRequest = {
        //             line_1: '',
        //             line_2: '',
        //             line_3: '',
        //             city: '',
        //             region: '',
        //             postcode: '',
        //             country_uuid: '',
        //         }

        //         setFormData({ ...parsedData });
        //     }
        // });
    }, [])

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

    function onSubmitPress(): void {
        companyService.update(formData).then((response) => {
            // Handle a successful API response
            console.log('Success signup:', response.data);
        })
            .catch((error) => {
                // Handle API request errors here
                console.error('Error signup:', error);
            });
    }

    const selectImage = async () => {
        const options = {
            title: 'Select Profile Picture',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            includeBase64: true
        };
        const result = await launchImageLibrary(options);
        if (result.assets) {
            setLogo(result.assets);
            setFormData((prevData) => ({
                ...prevData,
                ['logo']: result.assets[0].base64,
            }));
        }
    };

    async function onImageBrowsePress(): Promise<void> {
        await selectImage();
    }

    return (
        <ScrollView style={styles.scrollView}>
            {/* <KeyboardAvoidingView style={styles.containerView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
            <View style={styles.formContainer}>
                <View style={styles.formView}>
                    <View style={styles.imageContainer}>
                        <Image source={logo} style={styles.logo} />

                        <TouchableOpacity style={styles.iconContainer}>
                            <Icon
                                name="camera" // Replace with your desired icon name
                                type="font-awesome" // Replace with your desired icon library
                                size={40}
                                color={colors.PrimaryGreen}
                                onPress={() => onImageBrowsePress()}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* <TextInput
            hidden={true}
            value={formData.uuid}

          /> */}

                    <View>
                        <Text style={styles.label}>Company Name</Text>
                        <TextInput
                            placeholder="Company Name"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.name}
                            onChangeText={(text) => handleInputChange('name', text)}
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>Company Name Ar</Text>
                        <TextInput
                            placeholder="Company Name Ar"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.name_ar}
                            onChangeText={(text) => handleInputChange('name_ar', text)}
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            placeholder="Description"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                            value={formData.description}
                            onChangeText={(text) => handleInputChange('description', text)}
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>Line 1</Text>
                        <TextInput
                            value={formData.createAddressRequest.line_1}
                            onChangeText={(text) => handleInputChange('createAddressRequest.line_1', text)}
                            placeholder="Line 1"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>Line 2</Text>
                        <TextInput
                            value={formData.createAddressRequest.line_2}
                            onChangeText={(text) => handleInputChange('createAddressRequest.line_2', text)}
                            placeholder="Line 2"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>Line 3</Text>
                        <TextInput
                            value={formData.createAddressRequest.line_3}
                            onChangeText={(text) => handleInputChange('createAddressRequest.line_3', text)}
                            placeholder="Line 3"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>City</Text>
                        <TextInput
                            value={formData.createAddressRequest.city}
                            onChangeText={(text) => handleInputChange('createAddressRequest.city', text)}
                            placeholder="City"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>Region</Text>
                        <TextInput
                            value={formData.createAddressRequest.region}
                            onChangeText={(text) => handleInputChange('createAddressRequest.region', text)}
                            placeholder="Region / State"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>Postcode</Text>
                        <TextInput
                            value={formData.createAddressRequest.postcode}
                            onChangeText={(text) => handleInputChange('createAddressRequest.postcode', text)}
                            placeholder="Post Code"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>Country</Text>
                        <TextInput
                            value={formData.createAddressRequest.country_uuid}
                            onChangeText={(text) => handleInputChange('createAddressRequest.country_uuid', text)}
                            placeholder="Country"
                            placeholderTextColor={placeHolderTextColor}
                            style={styles.formTextInput}
                        />
                    </View>

                    <Button
                        onPress={() => onSubmitPress()}
                        title="Submit"
                        buttonStyle={styles.button}
                    />
                </View>
            </View>
            {/* </TouchableWithoutFeedback>
      </KeyboardAvoidingView> */}
        </ScrollView >
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
    logo: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
        borderWidth: 0,
        resizeMode: 'contain'
    },
    imageContainer: {
        position: 'relative',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconContainer: {
        backgroundColor: colors.PrimaryBlue,
        position: 'absolute',
        top: 100,
        left: 210
    },

});
