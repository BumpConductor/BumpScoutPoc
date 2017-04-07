import firebase from 'firebase';

class SolversListService {
  start() {
    this.database = firebase.database();
  }

  fetch() {
    return this.database.ref('solvers').orderByKey().once('value')
    .then((snapshot) => {
      return snapshot.val();
    });
  }
}

export default new SolversListService();
