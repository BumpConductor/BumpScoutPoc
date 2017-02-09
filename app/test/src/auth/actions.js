import firebase from 'firebase';
import {dispatch, spy, reset} from '../../helpers/dispatch';
import firebaseHelper from '../../helpers/firebase';

import * as actions from '../../../src/auth/actions';

const types = actions.types;
const auth = firebase.auth();

describe('auth', () => {
  describe('actions', () => {
    describe('signInWithGoogle', () => {
      describe('without error', () => {
        before(() => {
          reset();
          firebaseHelper.reset();
          firebaseHelper.auth.setResults([{success: 'user'}]);
          return dispatch(
            actions.signInWithGoogle()
          );
        });

        it('should dispatch SUBMIT_SIGN_IN', () => {
          spy.should.have.been.calledOnce;
          spy.should.have.been.calledWith({type: types.SUBMIT_SIGN_IN});
        });

        it('should call the firebase sign in with popup method', () => {
          auth.signInWithPopup.should.have.been.calledOnce;
          auth.signInWithPopup.args[0][0].should.equal(
            firebaseHelper.lastGoogleAuthProvider(),
          );
        });
      });

      describe('with error', () => {
        before(() => {
          reset();
          firebaseHelper.reset();
          firebaseHelper.auth.setResults([{error: 'error'}]);
          return dispatch(
            actions.signInWithGoogle()
          );
        });

        it('should dispatch SUBMIT_SIGN_IN and FAIL_SIGN_IN', () => {
          spy.should.have.been.calledTwice;
          spy.should.have.been
          .calledWith({type: types.SUBMIT_SIGN_IN}).subsequently
          .calledWith({
            type: types.FAIL_SIGN_IN,
            error: 'error',
          });
        });

        it('should call the firebase sign in with popup method', () => {
          auth.signInWithPopup.should.have.been.calledOnce;
          auth.signInWithPopup.args[0][0].should.equal(
            firebaseHelper.lastGoogleAuthProvider(),
          );
        });
      });
    });

    describe('signInWithEmailAndPassword', () => {
      describe('without error', () => {
        before(() => {
          reset();
          firebaseHelper.reset();
          firebaseHelper.auth.setResults([{success: 'user'}]);
          return dispatch(
            actions.signInWithEmailAndPassword('email', 'password')
          );
        });

        it('should dispatch SUBMIT_SIGN_IN', () => {
          spy.should.have.been.calledOnce;
          spy.should.have.been.calledWith({
            type: types.SUBMIT_SIGN_IN,
            email: 'email',
          });
        });

        it('should call the firebase sign in method', () => {
          auth.signInWithEmailAndPassword.should.have.been.calledOnce;
          auth.signInWithEmailAndPassword.should.have.been.calledWith(
            'email',
            'password',
          );
        });
      });

      describe('with error', () => {
        before(() => {
          reset();
          firebaseHelper.reset();
          firebaseHelper.auth.setResults([{error: 'error'}]);
          return dispatch(
            actions.signInWithEmailAndPassword('email', 'password')
          );
        });

        it('should dispatch SUBMIT_SIGN_IN and FAIL_SIGN_IN', () => {
          spy.should.have.been.calledTwice;
          spy.should.have.been
          .calledWith({
            type: types.SUBMIT_SIGN_IN,
            email: 'email',
          }).subsequently
          .calledWith({
            type: types.FAIL_SIGN_IN,
            error: 'error',
          });
        });

        it('should call the firebase sign in method', () => {
          auth.signInWithEmailAndPassword.should.have.been.calledOnce;
          auth.signInWithEmailAndPassword.should.have.been.calledWith(
            'email',
            'password',
          );
        });
      });
    });

    describe('signOut', () => {
      before(() => {
        reset();
        firebaseHelper.reset();
        firebaseHelper.auth.setResults([{success: null}]);
        dispatch(
          actions.signOut()
        );
      });

      it('should set the user to null', () => {
        spy.should.have.been.calledOnce;
        spy.should.have.been.calledWith({
          type: types.SET_USER,
          user: null,
        });
      });

      it('should call sign out', () => {
        auth.signOut.should.have.been.calledOnce;
      });
    });
  });
});
