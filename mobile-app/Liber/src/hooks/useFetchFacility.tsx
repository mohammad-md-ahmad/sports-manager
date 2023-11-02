import React, { useState } from 'react';
import FacilityService from '../../api/FacilityService';

export const FETCH_RESULTS = 10;
export const MAX_LENGTH = 50;

export const useFetchFacility = () => {
    const facilityService = new FacilityService();

    const [facilities, setFacilities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const getFacilities = async (isTop = false) => {
        setIsLoading(true);
        setSuccess(false);
        setErrorMessage('');

        try {
            const { data } = await facilityService.listByCompany();
console.log('data', data);
            if (isTop) {
                const newList = [...data?.data, ...facilities];
                const slicedData = [...newList].slice(0, MAX_LENGTH);

                setFacilities(slicedData);
            }

            if (!isTop) {
                const randomIndex = () => Math.ceil(Math.random() * 10);
                const newList = [...facilities, ...data?.data];
                const slicedData = [...newList].slice(-1 * MAX_LENGTH + randomIndex());

                setFacilities(slicedData);
            }

            setSuccess(true);
        } catch (error) {
            const theError =
                error?.response && error.response?.data?.message
                    ? error?.response?.data?.message
                    : error?.message;
            setErrorMessage(theError);
        }

        setIsLoading(false);
    };

    return { facilities, isLoading, success, getFacilities, errorMessage };
};
