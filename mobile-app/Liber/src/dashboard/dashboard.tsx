import React, { useEffect, useState } from "react";

import {
    SafeAreaView,
    StyleSheet,
    VirtualizedList,
} from "react-native";
import colors from "../../styles/colors";
import FacilityCard from "../common/facilityCard";
import FacilityService from "../../api/FacilityService";


export default function Dashboard(): React.JSX.Element {
    const facilityService = new FacilityService();

    const [facilities, setFacilities] = useState([]);

    useEffect(() => {
        facilityService.list()
            .then((response) => {
                console.log('facilityService', response.data);
                setFacilities(response.data?.data);
            }).catch((error) => {
                console.log('faciltiyService::list dashboard', error);
            });
    }, []);


    const getItem = (_data: unknown, index: number) => facilities[index];
    const getItemCount = (_data: unknown) => facilities.length;

    return (
        <SafeAreaView style={styles.container}>
            <VirtualizedList
                initialNumToRender={6}
                renderItem={({ item }) => <FacilityCard facility={item} />}
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
        marginTop: 5,

    },
    item: {
        backgroundColor: colors.PrimaryBlue,
        height: 150,
        marginVertical: 8,
        marginHorizontal: 16,
        padding: 20,
    },
    title: {
        fontSize: 32,
    },
});
