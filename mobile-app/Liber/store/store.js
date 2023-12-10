// store.js
import { createStore, combineReducers } from 'redux';
import { GlobaSateKey } from '../helpers/constants';

// Define your initial state
const initialState = {
  loading: false,
  currentScreen: 'Dashboard',
  companyData: null
};

// Create your reducer functions
const loadingReducer = (state = initialState.loading, action) => {
  if (action.type === GlobaSateKey.SetLoading) {
    return action.payload;
  }
  return state;
};

// Create your reducer functions
const currentScreenReducer = (state = initialState.currentScreen, action) => {
  if (action.type === GlobaSateKey.SetCurrentScreen) {
    return action.payload;
  }
  return state;
};

// Create your reducer functions
const companyDataReducer = (state = initialState.companyData, action) => {
  if (action.type === GlobaSateKey.SetCompanyData) {
    return action.payload;
  }
  return state;
};

// Combine reducers into a root reducer
const rootReducer = combineReducers({
  loading: loadingReducer,
  currentScreen: currentScreenReducer,
  companyData: companyDataReducer,
});

// Create the Redux store
const store = createStore(rootReducer);

export default store;
