import React, { useState } from "react";

import { StyleSheet, Text, View, } from "react-native";
import globalStyles from "../../styles/styles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Card, Image } from "react-native-elements";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { TouchableOpacity } from "react-native-gesture-handler";
import UserService from "../../api/UserService";
import { GlobaSateKey, Screens, UserType } from "../../helpers/constants";
import CompanyService from "../../api/CompanyService";
import { getUserData } from "../../helpers/userDataManage";
import MasonryList from '@react-native-seoul/masonry-list';
import MenuItemCard from "./menuItemCard";

export default function ProfileMenu() {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [companyData, setCompanyData] = useState({
        name: '',
        description: '',
        logo: require('./../../assets/images/liber_logo.png')
    });

    const [userData, setUserData] = useState({
        name: '',
        username: '',
        email: '',
        type: null,
        profile_picture: require('./../../assets/images/liber_logo.png')
    });

    const companyCachedData = useSelector(state => state.currentCompanyData);
    const userCachedData = useSelector(state => state.currentUserData);

    const userService = new UserService();
    const companyService = new CompanyService();

    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.

            getUserData().then((data: string | null) => {
                if (data !== null) {
                    let user = JSON.parse(data);
                    setUserData(user);
                    if (user?.type == UserType.CompanyUser) {

                        addItemsAtIndex([
                            {
                                title: "Users",
                                icon: "group",
                                navigateTo: Screens.UsersList
                            },
                            {
                                title: "Payment",
                                icon: "payments",
                                navigateTo: Screens.PaymentMethodsForm
                            },
                            {
                                title: "Facilities",
                                icon: "scoreboard",
                                navigateTo: Screens.Facilities
                            },
                            {
                                title: "Survies List",
                                icon: "payments",
                                navigateTo: Screens.SurviesList
                            },
                        ], 1)

                        if (companyCachedData) {
                            setCompanyData(companyCachedData);
                        } else {
                            companyService.getCompany().then((response) => {
                                setCompanyData({ ...response.data.data, logo: { uri: response.data?.data?.logo } });
                                dispatch({ type: GlobaSateKey.SetCurrentCompanyData, payload: { ...response.data.data, logo: { uri: response.data?.data?.logo } } });
                            }).catch((error) => {
                                console.error('company error', error)
                            });
                        }
                    } else {

                        if (userCachedData) {
                            setUserData(userCachedData);
                        } else {
                            userService.getUser().then((response) => {
                                setUserData({ ...response.data.data, profile_picture: { uri: response.data?.data?.profile_picture } });
                                dispatch({ type: GlobaSateKey.SetCurrentUserData, payload: { ...response.data.data, profile_picture: { uri: response.data?.data?.profile_picture } } });

                            }).catch((error) => {
                                console.error('user error', error)
                            });
                        }
                    }
                }
            });
        }, [])
    );

    const handleUserCardClick = () => {
        if (userData?.type == UserType.CompanyUser) {
            navigation.navigate(Screens.CompanyProfile);
        } else {
            navigation.navigate(Screens.UserProfile);
        }
    }

    const renderItem = (item) => {
        return <MenuItemCard menuItem={item.item} />
    }

    const [menuItems, setMenuItems] = useState([
        {
            title: "Calendar",
            icon: "calendar-month",
            navigateTo: Screens.Calendar
        },
        {
            title: "About",
            icon: "info",
            navigateTo: Screens.About
        },
        {
            title: "Logout",
            icon: "logout",
            navigateTo: null
        }
    ]);

    // Function to add an item at a specific index
    const addItemsAtIndex = (newItems, insertIndex) => {
        // Create a copy of the array to avoid mutating the state directly
        const newArray = [...menuItems];

        // Use splice to insert the new item at the specified index
        newArray.splice(insertIndex, 0, ...newItems);

        // Update the state with the new array
        setMenuItems(newArray);
    };

    return (
        <View style={styles.containerView}>
            <TouchableOpacity style={styles.userCard} onPress={handleUserCardClick} activeOpacity={0.8}>
                <Card containerStyle={styles.cardView}>
                    {userData?.type == UserType.CompanyUser ?
                        <View style={styles.container}>
                            <Image source={companyData.logo} style={styles.image} />
                            <Text style={styles.name}>{companyData.name}</Text>
                        </View >
                        :
                        <View style={styles.container}>
                            <Image
                                source={userData.profile_picture} style={styles.logo}
                                style={styles.image}
                            />
                            <View style={styles.userInfo}>
                                <Text style={styles.name}>{userData.first_name + ' ' + userData.last_name}</Text>
                                <Text style={styles.username}>{userData.username}</Text>
                                <Text style={styles.email}>{userData.email}</Text>
                            </View>
                        </View>
                    }
                </Card>
            </TouchableOpacity>

            <MasonryList
                data={menuItems}
                renderItem={renderItem}
                numColumns={2}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    containerView: {
        ...globalStyles.containerView,
        alignItems: "stretch",
    },
    userCard: {

    },
    cardView: {
        borderRadius: 10,
        borderColor: colors.PrimaryGreenLight,
        borderWidth: 0.5,
        marginHorizontal: 15,
        marginTop: 7,
        marginBottom: 7
    },
    container: {
        flexDirection: 'row',
        //height: 100,
    },
    image: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        marginRight: 20,
    },
    userInfo: {
        flex: 1, // Takes up the remaining space
        flexDirection: 'column',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.PrimaryBlue,
        fontFamily: fonts.Poppins.bold,
    }, subName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.PrimaryBlue,
        fontFamily: fonts.Poppins.bold,
    },
});