import firebase from 'firebase';

export default class {
  constructor(collection) {
    this.collection = collection;
  }

  start() {
    this.database = firebase.database();
  }

  submit(key) {
    const updates = {
      [`/${this.collection}/${key}`]: null,
    };
    return this.database.ref().update(updates);
  }
}
