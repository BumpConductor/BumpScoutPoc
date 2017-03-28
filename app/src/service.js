import firebase from 'firebase';
import config from '../config';

class Service {
  static start(app, store) {
    firebase.initializeApp(config);
    Service.stop = firebase.auth().onAuthStateChanged(
      (user) => store.dispatch(app.auth.setUser(user)),
    );
  }

  static signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  }

  static signInWithEmailAndPassword(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  static signOut() {
    return firebase.auth().signOut();
  }
}

export default Service;
