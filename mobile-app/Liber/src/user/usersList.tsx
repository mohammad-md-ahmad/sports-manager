import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, VirtualizedList } from 'react-native';
import fonts from '../../styles/fonts';
import { useFocusEffect } from '@react-navigation/native';
import UserService from '../../api/UserService';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserCard from '../common/userCard';
import { getUserData } from '../../helpers/userDataManage';

function UsersList(): React.JSX.Element {
    const userService = new UserService();

    const [users, setUsers] = useState([]);
    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.

            getUserData().then((data: string | null) => {
                var temp = [data === null ? null : JSON.parse(data)]
                userService.getUsers()
                    .then((response) => {
                        //console.log("userssss", temp)
                        setUsers(response.data?.data?.data);
                        //setUsers(temp);
                    }).catch((error) => {
                    });
            });


        }, [])
    );


    const getItem = (_data: unknown, index: number) => users[index];
    const getItemCount = (_data: unknown) => users.length;

    return (
        <SafeAreaView style={styles.container}>
            <VirtualizedList
                initialNumToRender={6}
                renderItem={({ item }) => <UserCard user={item} />}
                keyExtractor={item => item.uuid}
                getItemCount={getItemCount}
                getItem={getItem}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 0,

    },
    title: {
        fontSize: 32,
    },
});

export default UsersList;