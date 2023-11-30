import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "./constants";

export const storeToken = async (token: any) => {
  await AsyncStorage.setItem(Constants.tokenKey, token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem(Constants.tokenKey);
};

export const clearToken = async () => {
  await AsyncStorage.removeItem(Constants.tokenKey);
};
