import firebase from 'firebase';

class BumpsAddService {
  start() {
    this.database = firebase.database();
  }

  // TODO: figure out how to stub this in the firebase client instead?
  // istanbul ignore next
  getKey() {
    return this.database.ref('bumps').push().key;
  }

  submit(bump) {
    const key = this.getKey();
    const updates = {
      [`/bumps/${key}`]: bump,
    };
    return this.database.ref().update(updates).then(() => key);
  }
}

export default new BumpsAddService();
