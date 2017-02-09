import {start, stop} from '../../src/service';
import firebaseHelper from '../helpers/firebase';
import firebase from 'firebase';
import config from '../../config';

let store = {
  dispatch: sinon.spy(),
};
let actions = {
  auth: {
    setUser: () => 'setUser',
  },
};

describe('service', () => {
  before(() => {
    start(store, actions);
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
