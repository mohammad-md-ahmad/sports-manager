import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "./constants";

export const storeCountries= async (data: Object) => {
    await AsyncStorage.setItem(Constants.countriesKey, JSON.stringify(data));
};

export const getCountries= async () => {
    return await AsyncStorage.getItem(Constants.countriesKey);
};

export const clearCountries= async () => {
    await AsyncStorage.removeItem(Constants.countriesKey);
};
