import React, { useEffect, useState } from "react";

import { UserType } from "../../helpers/constants";
import CompanyDashboard from "./companyDashboard";
import UserDashboard from "./userDashboard";
import { getUserData } from "../../helpers/userDataManage";
import MiscService from "../../api/MiscService";
import { useFocusEffect } from "@react-navigation/native";
import { storeCountries } from "../../helpers/countriesDataManage";
import { storeFacilityTypes } from "../../helpers/facilityTypesDataManage";

export default function Dashboard(): React.JSX.Element {


    const miscService = new MiscService();

    const [facilities, setFacilities] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.
            miscService.lists().then((response) => {
                storeFacilityTypes(response.data?.data?.facility_types);
                storeCountries(response.data?.data?.countries);
            }).catch((error) => {
                console.log(error);
            });
        }, [])
    );

    const [userData, setUserData] = useState({});

    useEffect(() => {
        getUserData().then((data: string | null) => {
            setUserData(data === null ? null : JSON.parse(data));
        });
    }, []);

    return (
        <>
            {userData?.type == UserType.CompanyUser ? <CompanyDashboard /> : <UserDashboard />}
        </>
    );
}

