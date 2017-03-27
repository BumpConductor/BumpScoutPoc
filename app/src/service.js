import firebase from 'firebase';
import config from '../config';

class Service {
  static start(app, store) {
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(
      (user) => store.dispatch(app.auth.setUser(user)),
    );
    //Service.solversRef = new firebase.database().ref("solvers/");
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

//adding SOLVERS (problem solving orgs)

  static monitorSolverUpdates() {
    const solversRef = new firebase.database().ref('solvers/');
    solversRef.on('value', (snapshot) => 
      store.dispatch(app.solvers.solversUpdate(snapshot.val())));
  }

  static addSolver(solver) {
    console.log(`service: addSolver : ${solver}`);
    var creatorUID = firebase.auth().currentUser.uid;
    var creatorName = firebase.auth().currentUser.displayName;
    var solverData = {
      orgName : solver.orgName,
      orgURL : solver.orgURL,
      contactName : solver.contactName,
      contactEmail : event.detail.contactEmail,
      tags : solver.tags,
      creatorUID: creatorUID,
      creatorName: creatorName,
      created: firebase.database.ServerValue.TIMESTAMP,
      updated: firebase.database.ServerValue.TIMESTAMP
    };

    var newSolverKey = firebase.database().ref().child('solvers').push().key;
    
    var updates = {};
    updates['/solvers/' + newSolverKey] = solverData;
    firebase.database().ref().update(updates);
  }

}
export default Service;
