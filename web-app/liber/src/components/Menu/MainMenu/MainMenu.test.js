import React from 'react';
import ReactDOM from 'react-dom';
import MainMenu from './MainMenu';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MainMenu />, div);
  ReactDOM.unmountComponentAtNode(div);
});