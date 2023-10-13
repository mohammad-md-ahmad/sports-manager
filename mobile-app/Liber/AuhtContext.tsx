// AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { clearToken, getToken, storeToken } from './helpers/tokenManage';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

// Provide an initial value for the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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

    const login = async (token: string) => {
        // Implement your login logic here, and set isAuthenticated to true upon success
        setIsAuthenticated(true);
        storeToken(token);
    };

    const logout = async () => {
        // Implement your logout logic here and set isAuthenticated to false
        clearToken();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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