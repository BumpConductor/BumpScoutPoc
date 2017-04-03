import solutionsService from './service';
import {
  isUndefined,
  map,
} from 'lodash';
import {
  createSelector,
} from 'reselect';
import Duck from '../duck';

const initialState = {};
const duck = new Duck(
  'solutions',
  initialState,
  (state) => state.solutions,
);

//
// Selectors
//

// private selectors
const error = duck.selector((state) => state.error);
const pending = duck.selector((state) => state.pending);
const list = duck.selector((state) => state.list);
const addError = duck.selector((state) => state.addError);
const addPending = duck.selector((state) => state.addPending);

// public selectors
export const getAddedSolution = duck.selector((state) => state.addedSolution);

export const hasAddError = createSelector(
  addError,
  (addError) => !isUndefined(addError),
);

export const getAddErrorText = createSelector(
  hasAddError,
  addError,
  (hasAddError, addError) => hasAddError ? addError.toString() : '',
);

export const isAddPending = createSelector(
  addPending,
  (addPending) => !isUndefined(addPending),
);

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

export const getList = createSelector(
  list,
  (list) => isUndefined(list) ? [] : list,
);

//
// Private actions
//
const startFetch = duck.action('START_FETCH');
const setList = duck.action('SET_LIST');
const startAdd = duck.action('START_ADD');
const setAdded = duck.action('SET_ADDED');

//
// Public actions
//
export const reset = duck.action('RESET');
export const completeAdd = duck.action('COMPLETE_ADD');

export const fetch = () => (dispatch) => {
  dispatch(startFetch());
  return dispatch(setList(
    solutionsService.getSolutions(),
  ));
};

export const add = (solution) => (dispatch) => {
  dispatch(startAdd(solution));
  return dispatch(setAdded(
    solutionsService.addSolution(solution),
  ));
};

//
// Reducer
//
export default duck.reducer({
  [reset]: () => initialState,
  [startFetch]: () => ({
    pending: true,
  }),
  [setList]: (state, {payload, error}) => {
    if (error) {
      return {
        error: payload,
      };
    } else {
      return {
        list: map(payload, (fields, id) => ({...fields, id})),
      };
    }
  },
  [startAdd]: (state, {payload}) => {
    return {
      ...state,
      addError: undefined,
      addPending: true,
      addedSolution: payload,
    };
  },
  [setAdded]: (state, {payload, error}) => {
    if (error) {
      return {
        ...state,
        addPending: undefined,
        addError: payload,
      };
    } else {
      return {
        ...state,
        addPending: undefined,
        addedSolution: {
          ...state.addedSolution,
          id: payload,
        },
      };
    }
  },
  [completeAdd]: (state, {payload}) => {
    return {
      ...state,
      list: [...state.list, payload],
      addedSolution: undefined,
    };
  },
});
