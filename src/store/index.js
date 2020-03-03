import { applyMiddleware, createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";

import rootReducer from "../components/formBuilder/redux/reducer";
import surveyReducer from "../components/formBuilder/component/submission/redux/reducer";
import homeReducer from "../components/formBuilder/component/homePage/redux/reducer";
import formSubmitDataReducer from "../components/formBuilder/component/formData/redux/reducer";
import formBuilderReducer from "../components/formBuilder/component/formBuilder/redux/reducer";
import login from "./loginReducer";
import { Process, Approval } from "componentized-process/lib/index";

const { table_process, process, processMiddleware } = Process.redux;
const { table_approval, approval, approvalMiddleware } = Approval.redux;

export const history = createBrowserHistory();

const reducers = history =>
  combineReducers({
    login,
    table_process,
    table_approval,
    process,
    approval,
    formSubmitData: formSubmitDataReducer,
    forms: homeReducer,
    survey: surveyReducer,
    formBuilder: formBuilderReducer,
    rootData: rootReducer,
    router: connectRouter(history)
  });

const configureStore = preloadedState => {
  const middlewares = [
    thunk,
    processMiddleware,
    approvalMiddleware,
    routerMiddleware(history)
  ];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);

  return createStore(reducers(history), preloadedState, composedEnhancers);
};

export default configureStore();
