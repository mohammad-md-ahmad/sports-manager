import React from 'react';
import ReactDOM from 'react-dom';
import PageContainer from './PageContainer';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PageContainer />, div);
  ReactDOM.unmountComponentAtNode(div);
});