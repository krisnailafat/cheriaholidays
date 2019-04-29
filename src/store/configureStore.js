import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import placesReducer from "./reducers/places";
import uiReducer from "./reducers/ui";
import authReducer from "./reducers/auth";
import cheriaActionReducer from "./reducers/cheriaAction"
import muslimActionReducer from "./reducers/muslimAction"

const rootReducer = combineReducers({
  places: placesReducer,
  ui: uiReducer,
  auth: authReducer,

  //cheriaAction
  profile: cheriaActionReducer,
  isLogin: cheriaActionReducer,
  pembelian: cheriaActionReducer,
  point: cheriaActionReducer,

  lokasi: muslimActionReducer,
});

let composeEnhancers = compose;

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = () => {
  return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
};

export default configureStore;
