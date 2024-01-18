import React, { useState } from 'react';
import { StyleSheet, VirtualizedList } from 'react-native';
import fonts from '../../styles/fonts';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserData } from '../../helpers/userDataManage';
import CompanyCustomersService from '../../api/CompanyCustomersService';
import SurveyCard from './surveyCard';

function SurviesList(): React.JSX.Element {
    const companyCustomersService = new CompanyCustomersService();

    const [servies, setSurvies] = useState([]);
    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.

            getUserData().then((data: string | null) => {
                var temp = [data === null ? null : JSON.parse(data)]
                companyCustomersService.getUsers()
                    .then((response) => {
                        setSurvies(response.data?.data?.data);
                        //setUsers(temp);
                    }).catch((error) => {
                    });
            });


        }, [])
    );


    const getItem = (_data: unknown, index: number) => servies[index];
    const getItemCount = (_data: unknown) => servies.length;

    return (
        <SafeAreaView style={styles.container}>
            <VirtualizedList
                initialNumToRender={6}
                renderItem={({ item }) => <SurveyCard survey={item} />}
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

export default SurviesList;