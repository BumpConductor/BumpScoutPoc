import firebase from 'firebase';

export default class {
  constructor(collection) {
    this.collection = collection;
  }

  start() {
    this.database = firebase.database();
  }

  get(key) {
    return this.database.ref(`${this.collection}/${key}`).once('value')
    .then((snapshot) => {
      return snapshot.val();
    });
  }
}
