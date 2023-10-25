// store.js
import { createStore, combineReducers } from 'redux';

// Define your initial state
const initialState = {
  loading: false,
  currentScreen: 'Dashboard'
};

// Create your reducer functions
const loadingReducer = (state = initialState.loading, action) => {
  if (action.type === 'SET_LOADING') {
    return action.payload;
  }
  return state;
};

// Create your reducer functions
const currentScreenReducer = (state = initialState.currentScreen, action) => {
  if (action.type === 'SET_CURRENT_SCREEN') {
    return action.payload;
  }
  return state;
};


// Combine reducers into a root reducer
const rootReducer = combineReducers({
  loading: loadingReducer,
  currentScreen: currentScreenReducer,
});

// Create the Redux store
const store = createStore(rootReducer);

export default store;
