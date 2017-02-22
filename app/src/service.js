import firebase from 'firebase';
import config from '../config';

let unsubscribe;

export function start(store, actions) {
  firebase.initializeApp(config);
  unsubscribe = firebase.auth().onAuthStateChanged(
    (user) => store.dispatch(actions.auth.setUser(user)),
  );
}

export function stop() {
  unsubscribe();
}

