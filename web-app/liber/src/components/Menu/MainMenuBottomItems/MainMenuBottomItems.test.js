import React from 'react';
import ReactDOM from 'react-dom';
import MainMenuBottomItems from './MainMenuBottomItems';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MainMenuBottomItems />, div);
  ReactDOM.unmountComponentAtNode(div);
});