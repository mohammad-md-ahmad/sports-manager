import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Icon, ListItem } from 'react-native-elements';
import colors from '../../styles/colors';
import { useNavigation } from '@react-navigation/native';
import fonts from '../../styles/fonts';
import AuthService from '../../api/AuthService';
import { useAuth } from '../../AuhtContext';
import DeleteConfirmation from '../common/deleteConfirmation';
import LogoutConfirmation from '../common/logoutConfirmation';

interface MenuItem {
    title: string;
    icon: string;
    navigateTo: string;
}

interface MenuItemProps {
    menuItem: MenuItem;
}

const MenuItemCard: React.FC<MenuItemProps> = ({ menuItem }) => {
    const navigation = useNavigation();
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
    const authService = new AuthService();
    const { logout } = useAuth();

    const handleMenuItemClick = () => {
        if (menuItem.navigateTo) {
            navigation.navigate(menuItem.navigateTo);
        }
        else {
            if (menuItem.title == "Logout") {
                setIsLogoutModalVisible(true);
            }
        }
    }

    const handleLogout = () => {
        authService.logout().then((response) => {
            // Handle a successful API response
            logout();

        }).catch((error) => {
            // Handle API request errors here
            console.error('Error logout:', error);
        }).finally(() => {
            logout();
        });
    };

    const handleCancel = () => {
        setIsLogoutModalVisible(false);
    };

    return (
        <>
            <TouchableOpacity onPress={handleMenuItemClick} activeOpacity={0.8}>
                <Card containerStyle={styles.cardView}>
                    <View style={styles.container}>
                        <Icon
                            name={menuItem?.icon} // Replace with your desired icon name
                            type="material"
                            size={25}
                        />
                        <View style={styles.menuItemInfo}>
                            <Text style={styles.title}> {menuItem.title}</Text>
                        </View>

                    </View>
                </Card>
            </TouchableOpacity>
            <LogoutConfirmation
                isVisible={isLogoutModalVisible}
                onLogout={handleLogout}
                onCancel={handleCancel}
            />
        </>
    );
};

const styles = StyleSheet.create({
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
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginRight: 20,
    },
    menuItemInfo: {
        flex: 1, // Takes up the remaining space
        flexDirection: 'column',
    },
    title: {
        fontSize: 16,
        fontWeight: 'normal',
        color: colors.PrimaryBlue,
        fontFamily: fonts.Poppins.medium,
    }
});

export default MenuItemCard;
