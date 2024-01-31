import React, { useEffect, useState } from "react";

import { GlobaSateKey, UserType } from "../../helpers/constants";
import CompanyDashboard from "./companyDashboard";
import UserDashboard from "./userDashboard";
import { getUserData } from "../../helpers/userDataManage";
import MiscService from "../../api/MiscService";
import { useFocusEffect } from "@react-navigation/native";
import { storeCountries } from "../../helpers/countriesDataManage";
import { storeFacilityTypes } from "../../helpers/facilityTypesDataManage";
import { useDispatch, useSelector } from "react-redux";

export default function Dashboard(): React.JSX.Element {
    const miscService = new MiscService();

    const dispatch = useDispatch();

    const facilityTypes = useSelector(state => state.facilityTypes);
    const countries = useSelector(state => state.countries);
    const userGenders = useSelector(state => state.userGenders);
    const reportNames = useSelector(state => state.reportNames);

    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.

            if (!facilityTypes || !countries || !userGenders || !reportNames) {
                miscService.lists().then((response) => {
                    storeFacilityTypes(response.data?.data?.facility_types);
                    storeCountries(response.data?.data?.countries);

                    dispatch({ type: GlobaSateKey.SetFacilityTypes, payload: response.data?.data?.facility_types });
                    dispatch({ type: GlobaSateKey.SetCountries, payload: response.data?.data?.countries });
                    dispatch({ type: GlobaSateKey.SetUserGenders, payload: response.data?.data?.user_genders });
                    dispatch({ type: GlobaSateKey.SetReportNames, payload: response.data?.data?.report_names });

                }).catch((error) => {
                });
            }
        }, [])
    );

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        getUserData().then((data: string | null) => {
            setUserData(data === null ? null : JSON.parse(data));
        });
    }, []);

    return (
        <>
            {userData == null ? <></> : userData?.type == UserType.CompanyUser ? <CompanyDashboard /> : <UserDashboard />}
        </>
    );
}

