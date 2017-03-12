import firebase from 'firebase';
import config from '../config';

let unsubscribe;

export function start(app, store) {
  firebase.initializeApp(config);
  unsubscribe = firebase.auth().onAuthStateChanged(
    (user) => store.dispatch(app.auth.setUser(user)),
  );
}

export function stop() {
  unsubscribe();
}
