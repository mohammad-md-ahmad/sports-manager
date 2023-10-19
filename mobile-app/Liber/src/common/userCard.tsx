import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Card, ListItem } from 'react-native-elements';

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
        <Card>
            <Image
                source={{ uri: user.imageUri }}
                style={styles.image}
            />
            <ListItem>
                <ListItem.Content>
                    <ListItem.Title>{user.name}</ListItem.Title>
                    <ListItem.Subtitle>{user.email}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        </Card>
    );
};

const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 200,
    },
});

export default UserCard;
