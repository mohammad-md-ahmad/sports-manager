import React, { useState, useEffect } from "react";

import {
    SafeAreaView,
    StyleSheet,
    VirtualizedList,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Screens, UserType } from "../../helpers/constants";
import FacilityCard from "../common/facilityCard";
import FacilityService from "../../api/FacilityService";
import { getUserData } from "../../helpers/userDataManage";

function Facilities(): React.JSX.Element {
    const navigator = useNavigation();
    const facilityService = new FacilityService();

    function onAddFacilityPress(): void {
        navigator.navigate(Screens.FacilityForm);
    }

    const [facilities, setFacilities] = useState([]);
    const [userData, setUserData] = useState({});
    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.

            getUserData().then((data: string | null) => {
                setUserData(data === null ? null : JSON.parse(data));
            });

        }, [])
    );

    useEffect(() => {
        if (userData.type)
            if (userData.type == UserType.CompanyUser) {
                facilityService.listByCompany()
                    .then((response) => {
                        setFacilities(response.data?.data);
                    }).catch((error) => {
                    });
            }
            else {
                facilityService.list()
                    .then((response) => {
                        setFacilities(response.data?.data);
                    }).catch((error) => {
                    });
            }
    }, [userData]);

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
        marginVertical: 0,

    },
    title: {
        fontSize: 32,
    },
});

export default Facilities;
