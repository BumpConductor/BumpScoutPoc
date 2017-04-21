import firebase from 'firebase';

export default class {
  constructor(collection) {
    this.collection = collection;
  }

  start() {
    this.database = firebase.database();
  }

  // TODO: figure out how to stub this in the firebase client instead?
  // istanbul ignore next
  getTimestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  _setMetadata(entry) {
    const timestamp = this.getTimestamp();
    return {
      ...entry,
      metadata: {
        ...entry.metadata,
        modified: timestamp,
      },
    };
  }

  submit(entry) {
    entry = this._setMetadata(entry);
    const key = entry.metadata.key;
    const updates = {
      [`/${this.collection}/${key}`]: entry,
    };
    return this.database.ref().update(updates)
    .then(() => {
      return this.database.ref(`${this.collection}/${key}`).once('value');
    })
    .then((snapshot) => {
      return snapshot.val();
    });
  }
}
