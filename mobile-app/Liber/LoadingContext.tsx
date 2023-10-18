// LoadingContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
    loading: boolean;
    setGlobalLoading: (status: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(false);

    const setGlobalLoading = (status: boolean) => {
        setLoading(status);
    };

    return (
        <LoadingContext.Provider value={{ loading, setGlobalLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);

    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }

    return context;
}
