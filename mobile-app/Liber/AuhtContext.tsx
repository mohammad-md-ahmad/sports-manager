// AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { clearToken, getToken, storeToken } from './helpers/tokenManage';
import { storeUserData } from './helpers/userDataManage';
import { storeCompanyData } from './helpers/companyDataManage';

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

    useEffect(() => {
        // Check AsyncStorage for a token when the app initializes
        getToken()
            .then(token => {
                if (token) {
                    // Token found, user is authenticated
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
            setIsAuthenticated(true);
            storeToken(data.token);
            storeUserData(data.user);
            if (data.company)
                storeCompanyData(data.company);
        }
    };

    const logout = async () => {
        // Implement your logout logic here and set isAuthenticated to false
        clearToken();
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
