import resolve from 'redux-duckling';
import {
  createStore,
  applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import {
  composeWithDevTools,
} from 'redux-devtools-extension';

import error from './ducklings/error';
import auth from './ducklings/auth';
import bumps from './ducklings/bumps';
import solutions from './ducklings/solutions';
import solvers from './ducklings/solvers';

const {app, reducer} = resolve({
  error,
  auth,
  bumps,
  solutions,
  solvers,
});
export {app};

const logger = createLogger();
const composeEnhancers = composeWithDevTools({
  // devtool options
});

export const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(thunk, promise, logger))
);
