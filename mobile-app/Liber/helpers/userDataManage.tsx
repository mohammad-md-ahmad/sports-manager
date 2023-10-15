import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "./constants";

export const storeUserData = async (userData: Object) => {
    await AsyncStorage.setItem(Constants.userDataKey, JSON.stringify(userData));
};

export const getUserData = async () => {
    return await AsyncStorage.getItem(Constants.userDataKey);
};

export const clearUserData = async () => {
    await AsyncStorage.removeItem(Constants.userDataKey);
};
