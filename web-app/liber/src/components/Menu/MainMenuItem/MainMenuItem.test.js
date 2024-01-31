import React from 'react';
import ReactDOM from 'react-dom';
import MainMenuItem from './MainMenuItem';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MainMenuItem />, div);
  ReactDOM.unmountComponentAtNode(div);
});