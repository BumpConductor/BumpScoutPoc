import firebase from 'firebase';
import {
  isUndefined,
} from 'lodash';
import {
  createSelector,
} from 'reselect';
import Duck from '../duck';

const initialState = {};
const duck = new Duck(
  'auth',
  initialState,
  (state) => state.auth,
);

//
// Selectors
//

// display name helper
const displayName =
  (user) => isUndefined(user.displayName) ? user.email : user.displayName;

// private selectors
const error = duck.selector((state) => state.error);
const pending = duck.selector((state) => state.pending);
const user = duck.selector((state) => state.user);
const email = duck.selector((state) => state.email);

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

export const isSignedIn = createSelector(
  user,
  (user) => !isUndefined(user) && user !== null,
);

export const getDisplayName = createSelector(
  isSignedIn,
  user,
  (isSignedIn, user) => isSignedIn ? displayName(user) : '',
);

export const isSignedOut = createSelector(
  isSignedIn,
  isPending,
  (isSignedIn, isPending) => !isSignedIn && !isPending,
);

export const getSubmittedEmail = createSelector(
  email,
  (email) => isUndefined(email) ? '' : email,
);

//
// Private actions
//
const submitSignIn = duck.action('SUBMIT_SIGN_IN');
const failSignIn = duck.action('FAIL_SIGN_IN');

//
// Public actions
//
export const reset = duck.action('RESET');
export const setUser = duck.action('SET_USER');

export const signInWithGoogle = () => (dispatch) => {
  dispatch(submitSignIn());
  const provider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(provider)
  .catch((e) => {
    dispatch(failSignIn(e));
  });
};

export const signInWithEmailAndPassword = (email, password) => (dispatch) => {
  dispatch(submitSignIn(email));
  return firebase.auth().signInWithEmailAndPassword(email, password)
  .catch((e) => {
    dispatch(failSignIn(e));
  });
  // Even though the promise returns the user on success
  // the action should not dispatch a SET_USER as this is
  // already handled in the service through an onAuthStateChange
  // subscription, it does need to handle errors though. It's
  // unclear what the error callback optionally supplied to
  // onAuthStateChange is for but it doesn't get called for
  // sign in errors :s
};

export const signOut = () => {
  firebase.auth().signOut();
  return setUser(null);
};

//
// Reducer
//
export default duck.reducer({
  [reset]: () => initialState,
  [submitSignIn]: (state, action) => ({
    pending: true,
    email: action.payload,
  }),
  [failSignIn]: (state, action) => ({
    error: action.payload,
    email: state.email,
  }),
  [setUser]: (state, action) => ({
    user: action.payload,
  }),
});
