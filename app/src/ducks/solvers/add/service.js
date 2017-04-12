import firebase from 'firebase';

class SolversAddService {
  start() {
    this.database = firebase.database();
    this.auth = firebase.auth();
  }

  // TODO: figure out how to stub this in the firebase client instead?
  // istanbul ignore next
  getTimestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  // TODO: figure out how to stub this in the firebase client instead?
  // istanbul ignore next
  getKey() {
    return this.database.ref('solvers').push().key;
  }

  setMetadata(solver) {
    const timestamp = this.getTimestamp();
    return {
      metadata: {
        id: this.getKey(),
        owner: this.auth.currentUser.uid,
        ownerDisplayName: this.auth.currentUser.displayName,
        created: timestamp,
        modified: timestamp,
      },
      ...solver,
    };
  }

  submit(solver) {
    const key = solver.metadata.id;
    const updates = {
      [`/solvers/${key}`]: solver,
    };
    return this.database.ref().update(updates);
  }
}

export default new SolversAddService();
