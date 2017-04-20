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

  setMetadata(entry) {
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
    const key = entry.metadata.key;
    const updates = {
      [`/${this.collection}/${key}`]: entry,
    };
    return this.database.ref().update(updates);
  }
}
