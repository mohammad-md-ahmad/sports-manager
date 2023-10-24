import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { View, Image, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import globalStyles from '../../styles/styles';
import colors from '../../styles/colors';
import { Button } from 'react-native-elements';

const ImagePicker = (props) => {
    const [selectedImages, setSelectedImages] = useState(props?.selectedImages);
    const [selectedImagesBase64, setSelectedImagesBase64] = useState(props?.selectedImagesBase64);

    const openImagePicker = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: true,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error: ', response.error);
            } else if (response.assets && response.assets.length > 0) {
                const newImages = response.assets.map((asset) => asset.uri);
                const newBase64Images = response.assets.map((asset) => asset.base64);

                setSelectedImages([...selectedImages, ...newImages]);
                setSelectedImagesBase64([...selectedImagesBase64, ...newBase64Images]);
            }
        });
    };

    useEffect(() => {
        console.log('selectedImages', selectedImages);
        props?.setSelectedImages(selectedImages);
    }, [selectedImages]);

    useEffect(() => {
        console.log('selectedImages base64', selectedImagesBase64);
        props?.setSelectedImagesBase64(selectedImagesBase64);
    }, [selectedImagesBase64]);

    const removeImage = (index: any) => {
        const updatedImages = [...selectedImages];

        updatedImages.splice(index, 1);
        setSelectedImages(updatedImages);
    };

    return (
        <View style={styles.container}>
            {selectedImages.map((imageUri, index) => (
                <View key={index} style={styles.imageContainer}>
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.image}
                    />
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => removeImage(index)}
                    >
                        <Text style={styles.deleteBtnText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            ))}
            <View style={{ marginTop: 20 }}>
                <Button title="Upload Facility Photos" onPress={openImagePicker} buttonStyle={styles.button} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginVertical: 10,
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 10,
        flexDirection: 'row',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    deleteBtnText: {
        width: '100%',
        height: 48,
        padding: 5,
        paddingHorizontal: 10,
        fontSize: 20,
        fontWeight: 'bold',
        textAlignVertical: 'center',
        'backgroundColor': colors.SecondaryRed,
    },
    buttonContainer: {
        marginTop: 20,
    },
    button: {
        ...globalStyles.button,
        width: '100%'
    },
});

export default ImagePicker;
