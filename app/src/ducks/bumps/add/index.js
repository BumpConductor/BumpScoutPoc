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
  'bumps/add',
  initialState,
  (state) => state.bumps.add,
);

//
// Selectors
//

// private selectors
const error = duck.selector((state) => state.error);
const pending = duck.selector((state) => state.pending);

// public selectors
export const getBump = duck.selector((state) => state.bump);

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

export const submit = (bump) => (dispatch) => {
  dispatch(start(bump));
  return dispatch(set(
    service.submit(bump),
  ));
};

//
// Reducer
//
export default duck.reducer({
  [reset]: () => initialState,
  [start]: (state, {payload: bump}) => {
    return {
      ...state,
      error: undefined,
      pending: true,
      bump,
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
        bump: {
          ...state.bump,
          id: payload,
        },
      };
    }
  },
  [completeAdd]: (state) => {
    return {
      ...state,
      bump: undefined,
    };
  },
});
