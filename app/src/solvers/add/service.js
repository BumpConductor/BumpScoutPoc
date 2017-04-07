import firebase from 'firebase';

class SolversAddService {
  start() {
    this.database = firebase.database();
  }

  // TODO: figure out how to stub this in the firebase client instead?
  // istanbul ignore next
  getKey() {
    return this.database.ref('solvers').push().key;
  }

  submit(solver) {
    const key = this.getKey();
    const updates = {
      [`/solvers/${key}`]: solver,
    };
    return this.database.ref().update(updates).then(() => key);
  }
}

export default new SolversAddService();
