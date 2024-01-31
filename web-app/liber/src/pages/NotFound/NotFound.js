import React from 'react';

import './NotFound.scss';
import PageContainer from '../../components/PageContainer/PageContainer.lazy';


export default React.memo((props) => {

    return (
        <PageContainer id="NotFound">
            <h1>404</h1>
        </PageContainer>
    );
});
