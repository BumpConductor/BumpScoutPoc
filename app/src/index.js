import {
  createStore,
  combineReducers,
  applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import {
  composeWithDevTools,
} from 'redux-devtools-extension';

const logger = createLogger();
const composeEnhancers = composeWithDevTools({
  // devtool options
});

import authReducer from './ducks/auth';
import * as auth from './ducks/auth';
export {auth as auth};

import bumpsReducer from './ducks/bumps';
import * as bumps from './ducks/bumps';
export {bumps as bumps};

import solversReducer from './ducks/solvers';
import * as solvers from './ducks/solvers';
export {solvers as solvers};

import solutionsReducer from './ducks/solutions';
import * as solutions from './ducks/solutions';
export {solutions as solutions};

export default createStore(combineReducers({
  auth: authReducer,
  bumps: bumpsReducer,
  solvers: solversReducer,
  solutions: solutionsReducer,
}), composeEnhancers(applyMiddleware(thunk, promise, logger)));
