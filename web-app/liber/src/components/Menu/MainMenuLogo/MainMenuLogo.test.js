import React from 'react';
import ReactDOM from 'react-dom';
import MainMenuLogo from './MainMenuLogo';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MainMenuLogo />, div);
  ReactDOM.unmountComponentAtNode(div);
});