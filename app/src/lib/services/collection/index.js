import firebase from 'firebase';

import EntryService from './entry';
import CreateService from './create';
import UpdateService from './update';
import RemoveService from './remove';

export default class {
  constructor(collection) {
    this.collection = collection;
    this.entry = new EntryService(collection);
    this.create = new CreateService(collection);
    this.update = new UpdateService(collection);
    this.remove = new RemoveService(collection);
  }

  start() {
    this.database = firebase.database();
    this.entry.start();
    this.create.start();
    this.update.start();
    this.remove.start();
  }

  fetch() {
    return this.database.ref(this.collection).orderByKey().once('value')
    .then((snapshot) => {
      return Object.values(snapshot.val() || {});
    });
  }
}
