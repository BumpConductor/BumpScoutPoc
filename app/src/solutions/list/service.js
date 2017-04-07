import firebase from 'firebase';

class SolutionsListService {
  start() {
    this.database = firebase.database();
  }

  fetch() {
    return this.database.ref('solutions').orderByKey().once('value')
    .then((snapshot) => {
      return snapshot.val();
    });
  }
}

export default new SolutionsListService();
