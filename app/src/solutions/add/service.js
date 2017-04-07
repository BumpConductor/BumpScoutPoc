import firebase from 'firebase';

class SolutionsAddService {
  start() {
    this.database = firebase.database();
  }

  // TODO: figure out how to stub this in the firebase client instead?
  // istanbul ignore next
  getKey() {
    return this.database.ref('solutions').push().key;
  }

  submit(solution) {
    const key = this.getKey();
    const updates = {
      [`/solutions/${key}`]: solution,
    };
    return this.database.ref().update(updates).then(() => key);
  }
}

export default new SolutionsAddService();
