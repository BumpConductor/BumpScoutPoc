import firebase from 'firebase';

class SolutionsService {
  start() {
    this.database = firebase.database();
  }

  // TODO: figure out how to stub this in the firebase client instead?
  // istanbul ignore next
  getKey() {
    return this.database.ref('solutions').push().key;
  }

  getSolutions() {
    return this.database.ref('solutions').orderByKey().once('value')
    .then((snapshot) => {
      return snapshot.val();
    });
  }

  addSolution(solution) {
    const key = this.getKey();
    const updates = {
      [`/solutions/${key}`]: solution,
    };
    return this.database.ref().update(updates).then(() => key);
  }
}

export default new SolutionsService();
