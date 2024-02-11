import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import colors from '../../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { GlobaSateKey, Screens } from '../../helpers/constants';
import Swiper from 'react-native-swiper';
import globalStyles from '../../styles/styles';
import RatingRowWithNumber from './ratingRowWithNumber';
import { useDispatch } from 'react-redux';

interface Ad {
    title: string;
    url: string;
    description: string;
    gallery: [];
}

interface AdCardProps {
    ad: Ad;
}

const AdCard: React.FC<AdCardProps> = ({ ad }) => {
    const navigator = useNavigation();
    const dispatch = useDispatch();


    function onAdPress(): void {
        // dispatch({ type: GlobaSateKey.SetCompanyData, payload: ad });
        // navigator.navigate(Screens.Calendar)
        Linking.openURL(ad.url);
    }

    return (
        <TouchableOpacity onPress={onAdPress} activeOpacity={0.8}>
            <View style={styles.cardContainer}>
                {/* User Info Section */}

                <View style={styles.userInfoContainer}>
                    <View style={styles.userInfo}>
                        <View style={styles.nameRatingRow}>
                            <Text style={styles.userName}>{ad?.title}</Text>
                        </View>
                    </View>
                </View>


                {/* Post Content Section */}
                <Text style={styles.postText}>{ad?.description}</Text>

                {/* Post Image (if available) */}
                {ad?.gallery && ad?.gallery.length > 0 ?
                    <View style={styles.swiperContainer}>
                        <Swiper style={styles.wrapper} showsButtons={true}>
                            {
                                ad?.gallery?.map((galleryItem, index) => (
                                    <View style={styles.slide} key={index}>
                                        <Image source={{ uri: galleryItem.image }} style={styles.postImage} />
                                    </View>
                                ))
                            }
                        </Swiper>
                    </View> : <></>
                }
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginTop: 7,
        marginBottom: 7,
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: 10,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'column',
        marginBottom: 12,
        width: '100%',
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    userName: {
        color: colors.PrimaryBlue,
        fontWeight: 'bold',
    },
    postTime: {
        color: colors.Gray,
    },
    postText: {
        color: colors.Black,
        marginBottom: 12,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
    },
    interactions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    interactionText: {
        color: '#555',
    },
    swiperContainer: {
        height: 200
    },
    wrapper: {
    },
    slide: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    button: {
        ...globalStyles.button,
        width: 150,
        marginTop: 10,
        marginHorizontal: 5,
    },
    nameRatingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    }
});

export default AdCard;
