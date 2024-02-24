// store.js
import { createStore, combineReducers } from 'redux';
import { GlobaSateKey } from '../helpers/constants';

// Define your initial state
const initialState = {
  loading: false,
  currentScreen: 'Dashboard',
  companyData: null,
  authCompanyData: null,
  userData: null,
  authUserData: null,
  companiesList: null,
  facilityTypes: null,
  countries: null,
  userGenders: null,
  reportNames: null,
  companyPlans: [],
  companyCurrentPlan: null,

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
  if (action.type === GlobaSateKey.ResetStore) {
    return initialState.companyData;
  }
  if (action.type === GlobaSateKey.SetCompanyData) {
    return action.payload;
  }
  return state;
};

const currentCompanyDataReducer = (state = initialState.authCompanyData, action) => {
  if (action.type === GlobaSateKey.ResetStore) {
    return initialState.authCompanyData;
  }
  if (action.type === GlobaSateKey.SetAuthCompanyData) {
    return action.payload;
  }
  return state;
};

const userDataReducer = (state = initialState.userData, action) => {
  if (action.type === GlobaSateKey.ResetStore) {
    return initialState.userData;
  }
  if (action.type === GlobaSateKey.SetUserData) {
    return action.payload;
  }
  return state;
};

const currentUserDataReducer = (state = initialState.authUserData, action) => {
  if (action.type === GlobaSateKey.ResetStore) {
    return initialState.authUserData;
  }
  if (action.type === GlobaSateKey.SetAuthUserData) {
    return action.payload;
  }
  return state;
};

const companiesListReducer = (state = initialState.companiesList, action) => {
  if (action.type === GlobaSateKey.ResetStore) {
    return initialState.companiesList;
  }
  if (action.type === GlobaSateKey.SetCompaniesList) {
    return action.payload;
  }
  return state;
};

const facilityTypesReducer = (state = initialState.facilityTypes, action) => {
  if (action.type === GlobaSateKey.ResetStore) {
    return initialState.facilityTypes;
  }
  if (action.type === GlobaSateKey.SetFacilityTypes) {
    return action.payload;
  }
  return state;
};

const countriesReducer = (state = initialState.countries, action) => {
  if (action.type === GlobaSateKey.ResetStore) {
    return initialState.countries;
  }
  if (action.type === GlobaSateKey.SetCountries) {
    return action.payload;
  }
  return state;
};

const userGendersReducer = (state = initialState.userGenders, action) => {
  if (action.type === GlobaSateKey.ResetStore) {
    return initialState.userGenders;
  }
  if (action.type === GlobaSateKey.SetUserGenders) {
    return action.payload;
  }
  return state;
};

const reportNamesReducer = (state = initialState.reportNames, action) => {
  if (action.type === GlobaSateKey.ResetStore) {
    return initialState.reportNames;
  }
  if (action.type === GlobaSateKey.SetReportNames) {
    return action.payload;
  }
  return state;
};

const companyPlansReducer = (state = initialState.companyPlans, action) => {
  if (action.type === GlobaSateKey.ResetStore) {
    return initialState.companyPlans;
  }
  if (action.type === GlobaSateKey.SetCompanyPlans) {
    return action.payload;
  }
  return state;
};

const companyCurrentPlanReducer = (state = initialState.companyCurrentPlan, action) => {
  if (action.type === GlobaSateKey.ResetStore) {
    return initialState.companyCurrentPlan;
  }
  if (action.type === GlobaSateKey.SetCompanyCurrentPlan) {
    return action.payload;
  }
  return state;
};

// Combine reducers into a root reducer
const rootReducer = combineReducers({
  loading: loadingReducer,
  currentScreen: currentScreenReducer,
  companyData: companyDataReducer,
  authCompanyData: currentCompanyDataReducer,
  userData: userDataReducer,
  authUserData: currentUserDataReducer,
  companiesList: companiesListReducer,
  facilityTypes: facilityTypesReducer,
  countries: countriesReducer,
  userGenders: userGendersReducer,
  reportNames: reportNamesReducer,
  companyPlans: companyPlansReducer,
  companyCurrentPlan: companyCurrentPlanReducer,
});

// Create the Redux store
const store = createStore(rootReducer);

export default store;
