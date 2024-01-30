import React from 'react';

import './Home.scss';
import PageContainer from '../../components/PageContainer/PageContainer.lazy';


export default React.memo((props) => {

    return (
        <PageContainer id="home">
            <h1>Home</h1>
        </PageContainer>
    );
});
