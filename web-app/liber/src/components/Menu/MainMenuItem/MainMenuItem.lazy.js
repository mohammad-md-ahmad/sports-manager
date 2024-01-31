import React, { lazy, Suspense } from 'react';

const LazyMainMenuItem = lazy(() => import('./MainMenuItem'));

const MainMenuItem = props => (
  <Suspense fallback={null}>
    <LazyMainMenuItem {...props} />
  </Suspense>
);

export default MainMenuItem;
