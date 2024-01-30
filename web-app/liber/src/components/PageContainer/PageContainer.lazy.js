import React, { lazy, Suspense } from 'react';

const LazyPageContainer = lazy(() => import('./PageContainer'));

const PageContainer = props => (
  <Suspense fallback={null}>
    <LazyPageContainer {...props} />
  </Suspense>
);

export default PageContainer;
