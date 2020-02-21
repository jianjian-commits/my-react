import { applyMiddleware, createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";

import login from "./loginReducer";

export const history = createBrowserHistory();

const reducers = history =>
  combineReducers({
    login,
    router: connectRouter(history)
  });

const configureStore = preloadedState => {
  const middlewares = [thunk, routerMiddleware(history)];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);

  return createStore(reducers(history), preloadedState, composedEnhancers);
};

export default configureStore();
