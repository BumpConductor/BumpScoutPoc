import firebase from 'firebase';
import config from '../config';
import authService from './ducks/auth/service';
import solutionsService from './ducks/solutions/service';
import solversService from './ducks/solvers/service';
import bumpsService from './ducks/bumps/service';

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
