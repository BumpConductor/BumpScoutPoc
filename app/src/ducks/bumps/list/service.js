import firebase from 'firebase';

class BumpsListService {
  start() {
    this.database = firebase.database();
  }

  fetch() {
    return this.database.ref('bumps').orderByKey().once('value')
    .then((snapshot) => {
      return snapshot.val();
    });
  }
}

export default new BumpsListService();
