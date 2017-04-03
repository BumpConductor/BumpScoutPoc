import firebase from 'firebase';

class AuthService {
  start(app, store) {
    this.auth = firebase.auth();
    this.stop = this.auth.onAuthStateChanged(
      (user) => store.dispatch(app.auth.setUser(user)),
    );
  }

  signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.auth.signInWithPopup(provider);
  }

  signInWithEmailAndPassword(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  signOut() {
    return this.auth.signOut();
  }
}

export default new AuthService();
