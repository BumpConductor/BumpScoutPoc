import _ from 'lodash';
import firebase from 'firebase';

export const types = {
  SUBMIT_SIGN_IN: 'SUBMIT_SIGN_IN',
  SET_USER: 'SET_USER',
  FAIL_SIGN_IN: 'FAIL_SIGN_IN',
};

export const submitSignIn = (email) => {
  if (_.isUndefined(email)) {
    return {
      type: types.SUBMIT_SIGN_IN,
    };
  }
  return {
    type: types.SUBMIT_SIGN_IN,
    email: email,
  };
};

export const failSignIn = (error) => {
  return {
    type: types.FAIL_SIGN_IN,
    error: error,
  };
};

export const setUser = (user) => {
  return {
    type: types.SET_USER,
    user: user,
  };
};

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
