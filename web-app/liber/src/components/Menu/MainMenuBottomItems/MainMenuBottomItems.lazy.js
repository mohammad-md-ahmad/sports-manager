import React, { lazy, Suspense } from 'react';

const LazyMainMenuBottomItems = lazy(() => import('./MainMenuBottomItems'));

const MainMenuBottomItems = props => (
  <Suspense fallback={null}>
    <LazyMainMenuBottomItems {...props} />
  </Suspense>
);

export default MainMenuBottomItems;
