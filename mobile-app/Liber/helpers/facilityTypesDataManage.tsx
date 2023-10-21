import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "./constants";

export const storeFacilityTypes = async (data: Object) => {
    await AsyncStorage.setItem(Constants.facilityTypesKey, JSON.stringify(data));
};

export const getFacilityTypes = async () => {
    return await AsyncStorage.getItem(Constants.facilityTypesKey);
};

export const clearFacilityTypes = async () => {
    await AsyncStorage.removeItem(Constants.facilityTypesKey);
};
