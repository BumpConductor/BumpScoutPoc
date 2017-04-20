import firebase from 'firebase';
import config from '../config';
import authService from './ducklings/auth/service';
import solutionsService from './ducklings/solutions/service';
import solversService from './ducklings/solvers/service';
import bumpsService from './ducklings/bumps/service';

class Service {
  start(app, store) {
    firebase.initializeApp(config);
    authService.start(app, store);
    solutionsService.start();
    solversService.start();
    bumpsService.start();
  }
}

export default new Service();
