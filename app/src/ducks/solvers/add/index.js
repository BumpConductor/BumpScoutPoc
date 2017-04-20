import service from './service';
import {
  completeAdd,
} from '../shared';
import {
  isUndefined,
} from 'lodash';
import {
  createSelector,
} from 'reselect';
import Duck from '../../../lib/duck';

const initialState = {};
const duck = new Duck(
  'solvers/add',
  initialState,
  (state) => state.solvers.add,
);

//
// Selectors
//

// private selectors
const error = duck.selector((state) => state.error);
const pending = duck.selector((state) => state.pending);
const added = duck.selector((state) => state.added);

// public selectors
export const getSolver = duck.selector((state) => state.solver);

export const hasError = createSelector(
  error,
  (error) => !isUndefined(error),
);

export const getErrorText = createSelector(
  hasError,
  error,
  (hasError, error) => hasError ? error.toString() : '',
);

export const isPending = createSelector(
  pending,
  (pending) => !isUndefined(pending),
);

export const isAdded = createSelector(
  added,
  (added) => !isUndefined(added),
);

//
// Private actions
//
const start = duck.action('START');
const set = duck.action('SET');

//
// Public actions
//
export const reset = duck.action('RESET');

export const submit = (solver) => (dispatch) => {
  solver = service.setMetadata(solver);
  dispatch(start(solver));
  return dispatch(set(
    service.submit(solver),
  ));
};

//
// Reducer
//
export default duck.reducer({
  [reset]: () => initialState,
  [start]: (state, {payload: solver}) => {
    return {
      ...state,
      error: undefined,
      pending: true,
      solver,
    };
  },
  [set]: (state, {payload, error}) => {
    if (error) {
      return {
        ...state,
        pending: undefined,
        error: payload,
      };
    } else {
      return {
        ...state,
        pending: undefined,
        added: true,
      };
    }
  },
  [completeAdd]: (state) => {
    return {
      ...state,
      solver: undefined,
      added: undefined,
    };
  },
});
