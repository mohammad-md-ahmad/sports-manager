import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Card, Icon, ListItem } from 'react-native-elements';
import colors from '../../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { Screens } from '../../helpers/constants';
import fonts from '../../styles/fonts';
import Swiper from 'react-native-swiper';
import globalStyles from '../../styles/styles';
import RatingRowWithNumber from './ratingRowWithNumber';

interface Company {
    name: string;
    logo: string;
    description: string;
    address: {
    },
    gallery: [];
}

interface CompanyCardProps {
    company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
    const navigator = useNavigation();
    const handleCompanyClick = () => {
        navigator.navigate(Screens.CompanyProfile);
    }

    function onBookingPress(): void {
        navigator.navigate(Screens.Calendar)
    }

    return (
        <View style={styles.cardContainer}>
            {/* User Info Section */}
            <TouchableOpacity onPress={handleCompanyClick} activeOpacity={0.8}>
                <View style={styles.userInfoContainer}>
                    <Image source={{ uri: company?.logo }} style={styles.avatar} />
                    <View style={styles.userInfo}>
                        <View style={styles.nameRatingRow}>
                            <Text style={styles.userName}>{company?.name}</Text>
                            <RatingRowWithNumber ratingData={{ratingNumber: company?.total_rating}} />
                        </View>
                        <Text style={styles.postTime}>{
                            (company?.address?.region ?? '') +
                            (company?.address?.region && company?.address?.city ? ', ' : '') +
                            (company?.address?.city ?? '')}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Post Content Section */}
            <Text style={styles.postText}>{company?.description}</Text>

            {/* Post Image (if available) */}
            {company?.gallery && company?.gallery.length > 0 ?
                <View style={styles.swiperContainer}>
                    <Swiper style={styles.wrapper} showsButtons={true}>
                        {
                            company?.gallery?.map((galleryItem, index) => (
                                <View style={styles.slide} key={index}>
                                    <Image source={{ uri: galleryItem.image }} style={styles.postImage} />
                                </View>
                            ))
                        }
                    </Swiper>
                </View> : <></>
            }

            {/* Like, Comment, Share Section */}
            <View style={styles.interactions}>
                <Button
                    onPress={() => onBookingPress()}
                    title="Book Now"
                    buttonStyle={styles.button}
                    icon={
                        <Icon
                            name="calendar-month" // Replace with your desired icon name
                            type="material"
                            size={22}
                            color="white"
                        />
                    }
                />
            </View>
        </View>
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
        flexDirection: 'row',
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
        fontWeight: 'bold',
    },
    postTime: {
        color: '#555',
    },
    postText: {
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
        marginBottom: 14,
        width: '100%',
    }
});

export default CompanyCard;
