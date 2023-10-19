import React, { useEffect, useState } from "react";

import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    VirtualizedList,
} from "react-native";
import globalStyles from "../../styles/styles";
import colors from "../../styles/colors";
import FacilityCard from "../common/facilityCard";
import FacilityService from "../../api/FacilityService";

export default function Dashboard(): React.JSX.Element {

    const facilityService = new FacilityService();

    const [facilities, setFacilities] = useState([
        {
            uuid: 'asdsf11',
            name: 'F1',
            type: 'MiniFootball',
            details: {
                length: '60',
                width: '40',
            },
        },
        {
            uuid: 'asdsf13',
            name: 'F2',
            type: 'Basketball',
            details: {
                length: '60',
                width: '40',
            },
        },
        {
            uuid: 'asdsf12',
            name: 'F3',
            type: 'VolleyBall',
            details: {
                length: '60',
                width: '40',
            },
        }, {
            uuid: 'asdsf14',
            name: 'F4',
            type: 'MiniFootball',
            details: {
                length: '60',
                width: '40',
            },
        }, {
            uuid: 'asdsf15',
            name: 'F5',
            type: 'MiniFootball',
            details: {
                length: '60',
                width: '40',
            },
        }, {
            uuid: 'asdsf16',
            name: 'F6s',
            type: 'MiniFootball',
            details: {
                length: '60',
                width: '40',
            },
        },
    ])

    type ItemData = {
        uuid: string;
        name: string;
        type: string;
        details: {
            length: string;
            width: string;
        };
    };

    useEffect(() => {
        // facilityService.list().then((response) => {
        //     console.log('facilityService', response.data)
        // })


    }, []);

    const getItem = (_data: unknown, index: number): ItemData => facilities[index];

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
