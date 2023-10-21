import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "./constants";

export const storeCompanyData = async (companyData: Object) => {
    await AsyncStorage.setItem(Constants.companyDataKey, JSON.stringify(companyData));
};

export const getCompanyData = async () => {
    return await AsyncStorage.getItem(Constants.companyDataKey);
};

export const clearCompanyData = async () => {
    await AsyncStorage.removeItem(Constants.companyDataKey);
};
