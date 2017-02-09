import reducer from '../../../src/auth/reducer';
import * as actions from '../../../src/auth/actions';

describe('auth', () => {
  describe('reducer', () => {
    it('should set the initial state to an empty object', () => {
      reducer(undefined, {type: '@@redux/INIT'}).should.eql({});
    });

    describe('SUBMIT_SIGN_IN', () => {
      it('should set pending to true and record the email address', () => {
        reducer({
          user: 'user',
          error: 'error',
        }, actions.submitSignIn('email')).should.eql({
          email: 'email',
          pending: true,
        });
      });
    });

    describe('FAIL_SIGN_IN', () => {
      it('should set the error', () => {
        reducer({
          user: 'user',
          pending: true,
          email: 'email',
        }, actions.failSignIn('error')).should.eql({
          error: 'error',
          email: 'email',
        });
      });
    });

    describe('SET_USER', () => {
      describe('with a valid user', () => {
        it('should set the user', () => {
          reducer({
            error: 'error',
            pending: true,
            email: 'email',
          }, actions.setUser('user')).should.eql({
            user: 'user',
          });
        });
      });

      describe('with a null user', () => {
        it('should unset everything', () => {
          reducer({
            user: 'user',
            error: 'error',
            pending: true,
            email: 'email',
          }, actions.setUser(null)).should.eql({
          });
        });
      });
    });
  });
});
