import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button, Card, ListItem } from 'react-native-elements';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import globalStyles from '../../styles/styles';

interface User {
    name: string;
    email: string;
    imageUri: string;
}

interface UserCardProps {
    user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
    return (
        <Card containerStyle={styles.cardView}>
            <View style={styles.container}>
                <Image
                    source={user.imageUri ? { uri: user.imageUri } : require('./../../assets/images/liber_logo.png')}
                    style={styles.image}
                />
                <View style={styles.userInfo}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.value}>{user?.full_name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>{user?.email}</Text>
                    </View>

                </View>

            </View>
            <View>
                <View style={styles.buttonRow}>
                    <Button
                        onPress={() => { }}
                        title="Hisotry"
                        buttonStyle={styles.historyButton}
                    />
                    <Button
                        onPress={() => { }}
                        title="View"
                        buttonStyle={styles.viewButton}
                    />
                </View>
            </View>
        </Card>
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
    userInfo: {
        flex: 1, // Takes up the remaining space
        flexDirection: 'column',
        marginTop: 15,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.PrimaryBlue,
        width: 80,
    }, value: {
        fontSize: 18,
        fontWeight: 'normal',
        color: colors.PrimaryBlue
    },
    row: {
        flexDirection: 'row',
    },
    historyButton: {
        ...globalStyles.button,
        width: 80,
        marginHorizontal: 5,
    },
    viewButton: {
        ...globalStyles.button,
        width: 80,
        marginHorizontal: 5,
        backgroundColor: colors.Orange,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center', // Adjust this to control the spacing between buttons
        alignItems: 'center',
        marginTop: 20,
    },
});

export default UserCard;
