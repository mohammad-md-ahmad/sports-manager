// store.js
import { createStore, combineReducers } from 'redux';
import { GlobaSateKey } from '../helpers/constants';

// Define your initial state
const initialState = {
  loading: false,
  currentScreen: 'Dashboard',
  companyData: null,
  companiesList: null,
  facilityTypes: null,
  countries: null,
};

// Create your reducer functions
const loadingReducer = (state = initialState.loading, action) => {
  if (action.type === GlobaSateKey.SetLoading) {
    return action.payload;
  }
  return state;
};

const currentScreenReducer = (state = initialState.currentScreen, action) => {
  if (action.type === GlobaSateKey.SetCurrentScreen) {
    return action.payload;
  }
  return state;
};

const companyDataReducer = (state = initialState.companyData, action) => {
  if (action.type === GlobaSateKey.SetCompanyData) {
    return action.payload;
  }
  return state;
};

const companiesListReducer = (state = initialState.companiesList, action) => {
  if (action.type === GlobaSateKey.SetCompaniesList) {
    return action.payload;
  }
  return state;
};

const facilityTypesReducer = (state = initialState.facilityTypes, action) => {
  if (action.type === GlobaSateKey.SetFacilityTypes) {
    return action.payload;
  }
  return state;
};

const countriesReducer = (state = initialState.countries, action) => {
  if (action.type === GlobaSateKey.SetCountries) {
    return action.payload;
  }
  return state;
};

// Combine reducers into a root reducer
const rootReducer = combineReducers({
  loading: loadingReducer,
  currentScreen: currentScreenReducer,
  companyData: companyDataReducer,
  companiesList: companiesListReducer,
  facilityTypes: facilityTypesReducer,
  countries: countriesReducer,
});

// Create the Redux store
const store = createStore(rootReducer);

export default store;
