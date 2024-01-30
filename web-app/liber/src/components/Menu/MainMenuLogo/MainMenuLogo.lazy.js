import React, { lazy, Suspense } from 'react';

const LazyMainMenuLogo = lazy(() => import('./MainMenuLogo'));

const MainMenuLogo = props => (
  <Suspense fallback={null}>
    <LazyMainMenuLogo {...props} />
  </Suspense>
);

export default MainMenuLogo;
