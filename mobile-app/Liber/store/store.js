// store.js
import { createStore, combineReducers } from 'redux';

// Define your initial state
const initialState = {
  loading: false,
};

// Create your reducer functions
const loadingReducer = (state = initialState.loading, action) => {
  if (action.type === 'SET_LOADING') {
    return action.payload;
  }
  return state;
};


// Combine reducers into a root reducer
const rootReducer = combineReducers({
  loading: loadingReducer,
});

// Create the Redux store
const store = createStore(rootReducer);

export default store;
