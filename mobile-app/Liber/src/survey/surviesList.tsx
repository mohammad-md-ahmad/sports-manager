import React, { useState } from 'react';
import { StyleSheet, VirtualizedList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CompanyCustomersService from '../../api/CompanyCustomersService';
import SurveyCard from './surveyCard';
import CompanySurveyService from '../../api/CompanySurveyService';

function SurviesList(): React.JSX.Element {
    const companySurveyService = new CompanySurveyService();

    const [survies, setSurvies] = useState([]);
    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.
            companySurveyService.listByCompany()
                .then((response) => {
                    setSurvies(response.data?.data?.data);
                    //setUsers(temp);
                }).catch((error) => {
                });
        }, [])
    );


    const getItem = (_data: unknown, index: number) => survies[index];
    const getItemCount = (_data: unknown) => survies.length;

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