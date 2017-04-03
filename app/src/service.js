import firebase from 'firebase';
import config from '../config';
import authService from './auth/service';
import solutionsService from './solutions/service';

class Service {
  start(app, store) {
    firebase.initializeApp(config);
    authService.start(app, store);
    solutionsService.start();
  }
}

export default new Service();
