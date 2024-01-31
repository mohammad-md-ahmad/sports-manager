import React from 'react';
import ReactDOM from 'react-dom';
import Router from './Router';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router />, div);
  ReactDOM.unmountComponentAtNode(div);
});