import service from './service';
import {
  completeAdd,
} from '../shared';
import {
  isUndefined,
  map,
} from 'lodash';
import {
  createSelector,
} from 'reselect';
import Duck from '../../duck';

const initialState = {};
const duck = new Duck(
  'solutions/list',
  initialState,
  (state) => state.solutions.list,
);

//
// Selectors
//

// private selectors
const error = duck.selector((state) => state.error);
const pending = duck.selector((state) => state.pending);
const entries = duck.selector((state) => state.entries);

// public selectors
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

export const getEntries = createSelector(
  entries,
  (entries) => isUndefined(entries) ? [] : entries,
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

export const fetch = () => (dispatch) => {
  dispatch(start());
  return dispatch(set(
    service.fetch(),
  ));
};

//
// Reducer
//
export default duck.reducer({
  [reset]: () => initialState,
  [start]: () => ({
    pending: true,
  }),
  [set]: (state, {payload, error}) => {
    if (error) {
      return {
        error: payload,
      };
    } else {
      return {
        entries: map(payload, (fields, id) => ({...fields, id})),
      };
    }
  },
  [completeAdd]: (state, {payload: solution}) => {
    return {
      ...state,
      entries: [...state.entries, solution],
    };
  },
});
