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
import Duck from '../../duck';

const initialState = {};
const duck = new Duck(
  'solutions/add',
  initialState,
  (state) => state.solutions.add,
);

//
// Selectors
//

// private selectors
const error = duck.selector((state) => state.error);
const pending = duck.selector((state) => state.pending);

// public selectors
export const getSolution = duck.selector((state) => state.solution);

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

//
// Private actions
//
const start = duck.action('START');
const set = duck.action('SET');

//
// Public actions
//
export const reset = duck.action('RESET');

export const submit = (solution) => (dispatch) => {
  dispatch(start(solution));
  return dispatch(set(
    service.submit(solution),
  ));
};

//
// Reducer
//
export default duck.reducer({
  [reset]: () => initialState,
  [start]: (state, {payload: solution}) => {
    return {
      ...state,
      error: undefined,
      pending: true,
      solution,
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
        solution: {
          ...state.solution,
          id: payload,
        },
      };
    }
  },
  [completeAdd]: (state) => {
    return {
      ...state,
      solution: undefined,
    };
  },
});
