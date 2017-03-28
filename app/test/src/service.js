/* eslint-disable no-invalid-this */
import service from '../../src/service';
import {
  helpers,
} from '../helpers/firebase';
import firebase from 'firebase';
import config from '../../config';
import _ from 'lodash';

const user = 'Fred Bloggs';
const email = 'fred@bloggs.com';
const password = 'my password';
const setUserAction = 'set user action';
const error = new Error('FAIL');

const auth = firebase.auth();

const store = {
  dispatch: sinon.spy(),
};

const app = {
  auth: {
    setUser: sinon.spy(() => setUserAction),
  },
};

describe('service', () => {
  given(
    () => service.start(app, store),
    () => service.stop()
  )
  .fork((startService) => {
    startService
    .then(() => firebase.initializeApp.should.have.been.calledOnce)
    .and(() => firebase.initializeApp.should.have.been.calledWith(config));

    startService
    .and(() => helpers.reset())
    .and(() => store.dispatch.reset())
    .and(() => app.auth.setUser.reset())
    .fork((reset) => {
      reset
      .and(() => helpers.auth.changeState(user))
      .then(() => app.auth.setUser.should.have.been.calledWith(user))
      .and(() => store.dispatch.should.have.been.calledOnce)
      .and(() => store.dispatch.should.have.been.calledWith(setUserAction));

      reset
      .and(() => helpers.auth.queueResult({success: user}))
      .and.a.promise.as('promise').from(
        () => service.signInWithGoogle()
      )
      .then(function() {
        this.promise.should.eventually.eql(user);
      })
      .and(() => auth.signInWithPopup.should.have.been.calledOnce)
      .and(() => helpers.auth.googleAuthProvider.should.not.be.null)
      .and(() => auth.signInWithPopup.args[0][0].should.equal(
        helpers.auth.googleAuthProvider,
      ));

      reset
      .and(() => helpers.auth.queueResult({error}))
      .and.a.promise.as('promise').from(
        () => service.signInWithGoogle()
      )
      .then(function() {
        this.promise.should.be.rejectedWith(error);
      })
      .and(() => auth.signInWithPopup.should.have.been.calledOnce)
      .and(() => helpers.auth.googleAuthProvider.should.not.be.null)
      .and(() => auth.signInWithPopup.args[0][0].should.equal(
        helpers.auth.googleAuthProvider,
      ));

      reset
      .and(() => helpers.auth.queueResult({success: user}))
      .and.a.promise.as('promise').from(
        () => service.signInWithEmailAndPassword(
          email,
          password,
        )
      )
      .then(function() {
        this.promise.should.eventually.eql(user);
      })
      .and(() => auth.signInWithEmailAndPassword.should.have.been.calledOnce)
      .and(() => auth.signInWithEmailAndPassword.should.have.been.calledWith(
        email,
        password,
      ));

      reset
      .and(() => helpers.auth.queueResult({error}))
      .and.a.promise.as('promise').from(
        () => service.signInWithEmailAndPassword(
          email,
          password,
        )
      )
      .then(function() {
        this.promise.should.be.rejectedWith(error);
      })
      .and(() => auth.signInWithEmailAndPassword.should.have.been.calledOnce)
      .and(() => auth.signInWithEmailAndPassword.should.have.been.calledWith(
        email,
        password,
      ));

      reset
      .and(() => helpers.auth.queueResult({success: void 0}))
      .and.a.promise.as('promise').from(
        () => service.signOut()
      )
      .then(function() {
        this.promise.should.be.resolved;
      })
      .and(() => auth.signOut.should.have.been.calledOnce);

      reset
      .and(() => helpers.auth.queueResult({error}))
      .and.a.promise.as('promise').from(
        () => service.signOut()
      )
      .then(function() {
        this.promise.should.be.rejectedWith(error);
      })
      .and(() => auth.signOut.should.have.been.calledOnce);
    });
  })
  .end();
});
