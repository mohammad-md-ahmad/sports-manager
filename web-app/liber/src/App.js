import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import AppLoader from './components/AppLoader/AppLoader';
import Store from './Store';

function App() {
  return (
    <Store>
      <AppLoader></AppLoader>
    </Store >
  );
}

export default App;
