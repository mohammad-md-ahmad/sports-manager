import React, { lazy, Suspense } from 'react';

const LazyMainMenu = lazy(() => import('./MainMenu'));

const MainMenu = props => (
  <Suspense fallback={null}>
    <LazyMainMenu {...props} />
  </Suspense>
);

export default MainMenu;
