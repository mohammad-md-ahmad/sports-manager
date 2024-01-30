import React, { useContext } from 'react';

import './PageContainer.scss';
import { Container } from '@mui/material';
import { Context } from '../../Store';


export default React.memo((props) => {
    const [globalState, globalStateDispatcher] = useContext(Context);
    return (
        <Container
            id={props?.id}
            maxWidth={false}
            className={"page-container " + globalState.domDirection}
        >
            {props?.children}
        </Container>
    );
});
