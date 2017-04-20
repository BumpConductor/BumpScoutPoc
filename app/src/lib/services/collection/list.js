import firebase from 'firebase';

export default class {
  constructor(collection) {
    this.collection = collection;
  }

  start() {
    this.database = firebase.database();
  }

  fetch() {
    return this.database.ref(this.collection).orderByKey().once('value')
    .then((snapshot) => {
      return Object.values(snapshot.val() || {});
    });
  }
}
