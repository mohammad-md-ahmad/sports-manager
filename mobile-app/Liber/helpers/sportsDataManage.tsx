import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "./constants";

export const storeSports = async (data: Object) => {
    await AsyncStorage.setItem(Constants.sportsKey, JSON.stringify(data));
};

export const getSports  = async () => {
    return await AsyncStorage.getItem(Constants.sportsKey);
};

export const clearSports = async () => {
    await AsyncStorage.removeItem(Constants.sportsKey);
};
