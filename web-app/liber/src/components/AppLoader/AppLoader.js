import React from 'react';
import './AppLoader.scss';

import Router from '../Router/Router.lazy';
import { Container } from '@mui/material';

export default React.memo((props) => {


    return (
        <Container
            maxWidth={false}
            className="h-100 no-padding-h"
        >
            <Router />
        </Container>
    );
});
