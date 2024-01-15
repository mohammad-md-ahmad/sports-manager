// AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { clearToken, getToken, storeToken } from './helpers/tokenManage';
import { clearUserData, getUserData, storeUserData } from './helpers/userDataManage';
import { clearCompanyData, getCompanyData, storeCompanyData } from './helpers/companyDataManage';
import { OneSignal } from 'react-native-onesignal';
import { GlobaSateKey } from './helpers/constants';
import { useDispatch, useSelector } from 'react-redux';

interface AuthContextType {
    isAuthenticated: boolean;
    userData: Object;
    login: (token: string) => void;
    logout: () => void;
}

// Provide an initial value for the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState({});

    const dispatch = useDispatch();
    const companyCachedData = useSelector(state => state.companyData);
    const userCachedData = useSelector(state => state.currentUserData);

    useEffect(() => {
        // Check AsyncStorage for a token when the app initializes
        getToken()
            .then(token => {
                if (token) {
                    // Token found, user is authenticated
                    getUserData().then((data: string | null) => {
                        let user = JSON.parse(data);
                        if (!userCachedData)
                            dispatch({ type: GlobaSateKey.SetCurrentUserData, payload: { ...user, profile_picture: { uri: user?.profile_picture } } });
                        OneSignal.login(user?.uuid);
                    });

                    if (!companyCachedData)
                        getCompanyData().then((data: string | null) => {
                            let company = JSON.parse(data);
                            dispatch({ type: GlobaSateKey.SetCompanyData, payload: { ...company, logo: { uri: company?.logo } } });
                        });

                    setIsAuthenticated(true);
                } else {
                    // No token found, user is not authenticated
                    setIsAuthenticated(false);
                }
            })
            .catch(error => {
                console.error('Error checking token in AsyncStorage:', error);
            });
    }, []);

    const login = async (data: Object) => {
        // Implement your login logic here, and set isAuthenticated to true upon success
        if (data.token) {
            OneSignal.login(data?.user?.uuid);
            await storeUserData(data.user);
            dispatch({ type: GlobaSateKey.SetCurrentUserData, payload: { ...data?.user, profile_picture: { uri: data?.user?.profile_picture } } });

            if (data.company) {
                await storeCompanyData(data.company);
                dispatch({ type: GlobaSateKey.SetCompanyData, payload: { ...data?.company, logo: { uri: data?.company?.logo } } });
            }

            await storeToken(data.token);
            setIsAuthenticated(true);
        }
    };

    const logout = async () => {
        // Implement your logout logic here and set isAuthenticated to false
        await clearToken();
        await clearCompanyData();
        await clearUserData();
        OneSignal.logout();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
