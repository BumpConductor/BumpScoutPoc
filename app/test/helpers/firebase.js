import firebase from 'firebase';
import sinon from 'sinon';
import _ from 'lodash';

function overrideAuth(auth) {
  let currentUser = null;
  let authStateChangedListeners = [];
  let results;
  function notifyAuthStateChanged(user) {
    _.invokeMap(authStateChangedListeners, _.call, null, user);
  }
  auth.signInWithPopup = sinon.spy(() => {
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        const result = results.shift();
        if (_.isUndefined(result.error)) {
          resolve(result.success);
        } else {
          reject(result.error);
        }
      });
    });
  });
  auth.signInWithEmailAndPassword = sinon.spy(() => {
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        const result = results.shift();
        if (_.isUndefined(result.error)) {
          resolve(result.success);
        } else {
          reject(result.error);
        }
      });
    });
  });
  auth.onAuthStateChanged = sinon.spy((listener) => {
    authStateChangedListeners.push(listener);
    return () => {
      _.remove(authStateChangedListeners, listener);
    };
  });
  auth.signOut = sinon.spy(() => {
    return new Promise((resolve) => {
      process.nextTick(() => {
        resolve();
      });
    });
  });
  const helpers = {
    setResults: (_results) => {
      results = _results.slice(0);
    },
    changeState: (user) => {
      currentUser = user;
      notifyAuthStateChanged(user);
    },
    getCurrentUser: () => currentUser,
    setCurrentUser: (user) => {
      currentUser = user;
    },
    reset: () => {
      auth.signInWithPopup.reset();
      auth.signInWithEmailAndPassword.reset();
      auth.onAuthStateChanged.reset();
      auth.signOut.reset();
    },
  };
  return helpers;
}

function overrideFirebase(firebase) {
  const auth = {};
  let lastGoogleAuthProvider;
  firebase.initializeApp = sinon.spy();
  firebase.auth = sinon.spy(() => auth);
  firebase.auth.GoogleAuthProvider = function() {
    lastGoogleAuthProvider = this;
  };
  const helpers = {
    auth: overrideAuth(firebase.auth()),
    lastGoogleAuthProvider: () => {
      return lastGoogleAuthProvider;
    },
    reset: () => {
      firebase.initializeApp.reset();
      firebase.auth.reset();
      helpers.auth.reset();
    },
  };
  return helpers;
}

export default overrideFirebase(firebase);
