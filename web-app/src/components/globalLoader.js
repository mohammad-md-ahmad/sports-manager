import { Backdrop, CircularProgress } from '@mui/material';
import React, { useEffect } from 'react';
import { useAuth } from 'src/hooks/use-auth';

const GlobalLoader = () => {
    const auth = useAuth();

    const containerStyle = {
        zIndex: 1000000
    };

    return (
        <Backdrop
            id="global-loader"
            open={auth.showGlobalLoader}
            style={containerStyle}
        >
            <CircularProgress
                size={50}
            />
        </Backdrop>
    );
};

export default GlobalLoader;