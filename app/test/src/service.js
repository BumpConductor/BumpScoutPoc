import {start, stop} from '../../src/service';
import firebaseHelper from '../helpers/firebase';
import firebase from 'firebase';
import config from '../../config';

const store = {
  dispatch: sinon.spy(),
};

const app = {
  auth: {
    setUser: () => 'setUser',
  },
};

describe('service', () => {
  before(() => {
    start(app, store);
  });

  after(() => {
    stop();
  });

  it('should initialize firebase', () => {
    firebase.initializeApp.should.have.been.calledOnce;
    firebase.initializeApp.should.have.been.calledWith(config);
  });

  describe('onAuthStateChanged', () => {
    before(() => {
      firebaseHelper.auth.changeState('user');
    });

    it('should dispatch a setUser action', () => {
      store.dispatch.should.have.been.calledOnce;
      store.dispatch.should.have.been.calledWith('setUser');
    });
  });
});
