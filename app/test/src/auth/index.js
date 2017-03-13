import _ from 'lodash';
import firebase from 'firebase';
import firebaseHelper from '../../helpers/firebase';
import * as auth from '../../../src/auth';
import reducer from '../../../src/auth';
import {
  createStore,
  applyMiddleware,
  combineReducers,
} from 'redux';
import thunk from 'redux-thunk';

const firebaseAuth = firebase.auth();

let states;
const store = createStore(combineReducers({
  auth: reducer,
}), applyMiddleware(thunk));
store.subscribe(() => {
  states.push(store.getState());
});
async function reset({actions, firebaseAuthResults}) {
  firebaseHelper.reset();
  firebaseHelper.auth.setResults(firebaseAuthResults);
  store.dispatch(auth.reset());
  await actions.reduce(async (promise, action) => {
    await promise;
    await store.dispatch(action);
  }, Promise.resolve());
  states = [];
}

const email = 'fred@bloggs.com';
const password = 'my password';
const displayName = 'Fred Bloggs';
const error = 'failed sign in';
const user = {
  displayName: displayName,
  email: email,
};
const userWithoutDisplayName = {
  email: email,
};

describe('auth', () => {
  describe('with the initial state', () => {
    before(() => {
      states = [
        store.getState(),
      ];
    });

    it('should not report an error', () => {
      auth.hasError(states[0]).should.be.false;
    });

    it('should not have error text', () => {
      auth.getErrorText(states[0]).should.eql('');
    });

    it('should not be pending', () => {
      auth.isPending(states[0]).should.be.false;
    });

    it('should not be signed in', () => {
      auth.isSignedIn(states[0]).should.eql(false);
    });

    it('should not have a display name', () => {
      auth.getDisplayName(states[0]).should.eql('');
    });

    it('should be signed out', () => {
      auth.isSignedOut(states[0]).should.eql(true);
    });

    it('should not have a submitted email', () => {
      auth.getSubmittedEmail(states[0]).should.eql('');
    });

    describe('then sign in', () => {
      _.forEach({
        'with google': {
          action: auth.signInWithGoogle(),
          submittedEmail: '',
          checkFirebaseAuthCall: () => {
            firebaseAuth.signInWithPopup.should.have.been.calledOnce;
            firebaseAuth.signInWithPopup.args[0][0].should.equal(
              firebaseHelper.lastGoogleAuthProvider(),
            );
          },
        },
        'with email and password': {
          action: auth.signInWithEmailAndPassword(email, password),
          submittedEmail: email,
          checkFirebaseAuthCall: () => {
            firebaseAuth.signInWithEmailAndPassword.should.have.been.calledOnce;
            firebaseAuth.signInWithEmailAndPassword.should.have.been.calledWith(
              email,
              password,
            );
          },
        },
      }, (signInCase, description) => {
        describe(description, () => {
          _.forEach({
            'and fail': {
              firebaseAuthResults: [{
                error: error,
              }],
              states: [{
                error: false,
                errorText: '',
                pending: true,
                signedIn: false,
                signedOut: false,
              }, {
                error: true,
                errorText: error,
                pending: false,
                signedIn: false,
                signedOut: true,
              }],
            },
            'and succeed': {
              firebaseAuthResults: [{
                success: user,
              }],
              states: [{
                error: false,
                errorText: '',
                pending: true,
                signedIn: false,
                signedOut: false,
              }],
            },
          }, (resultCase, description) => {
            describe(description, () => {
              before(async () => {
                await reset({
                  actions: [],
                  firebaseAuthResults: resultCase.firebaseAuthResults,
                });
                await store.dispatch(signInCase.action);
              });

              it('should sign in with the correct method', () => {
                signInCase.checkFirebaseAuthCall();
              });

              it('should update the state the correct number of times', () => {
                states.length.should.eql(resultCase.states.length);
              });

              for (
                let stateIndex = 0;
                stateIndex < resultCase.states.length;
                stateIndex++
              ) {
                let testState;
                let state;

                describe(`then state ${stateIndex}`, () => {
                  before(() => {
                    testState = resultCase.states[stateIndex];
                    state = states[stateIndex];
                  });

                  it('should have the correct error state', () => {
                    auth.hasError(state).should.eql(testState.error);
                  });

                  it('should have the correct error text', () => {
                    auth.getErrorText(state).should.eql(testState.errorText);
                  });

                  it('should have the correct pending state', () => {
                    auth.isPending(state).should.eql(testState.pending);
                  });

                  it('shaould have the correct signed in state', () => {
                    auth.isSignedIn(state).should.eql(testState.signedIn);
                  });

                  it('should not have a display name', () => {
                    auth.getDisplayName(state).should.eql('');
                  });

                  it('should have the correct signed out state', () => {
                    auth.isSignedOut(state).should.eql(testState.signedOut);
                  });

                  it('should have the correct submitted email', () => {
                    auth.getSubmittedEmail(state).should.eql(
                      signInCase.submittedEmail,
                    );
                  });
                });
              }

              describe('then set user', () => {
                _.forEach({
                  'with a displayName': {
                    user,
                    displayName,
                  },
                  'with no displayName': {
                    user: userWithoutDisplayName,
                    displayName: email,
                  },
                }, (value, key) => {
                  describe(key, () => {
                    before(async () => {
                      await reset({
                        actions: [
                          signInCase.action,
                        ],
                        firebaseAuthResults: resultCase.firebaseAuthResults,
                      });
                      store.dispatch(auth.setUser(value.user));
                    });

                    it('should change the state once', () => {
                      states.length.should.eql(1);
                    });

                    it('should not report an error', () => {
                      auth.hasError(states[0]).should.be.false;
                    });

                    it('should not have error text', () => {
                      auth.getErrorText(states[0]).should.eql('');
                    });

                    it('should not be pending', () => {
                      auth.isPending(states[0]).should.be.false;
                    });

                    it('should be signed in', () => {
                      auth.isSignedIn(states[0]).should.eql(true);
                    });

                    it('should set the display name', () => {
                      auth.getDisplayName(states[0]).should.eql(
                        value.displayName,
                      );
                    });

                    it('should not be signed out', () => {
                      auth.isSignedOut(states[0]).should.eql(false);
                    });

                    it('should not have a submitted email', () => {
                      auth.getSubmittedEmail(states[0]).should.eql('');
                    });

                    describe('then sign out', () => {
                      before(async () => {
                        await reset({
                          actions: [
                            signInCase.action,
                            auth.setUser(value.user),
                          ],
                          firebaseAuthResults: resultCase.firebaseAuthResults,
                        });
                        store.dispatch(auth.signOut());
                      });

                      it('should have signed out with firebase', () => {
                        firebaseAuth.signOut.should.have.been.calledOnce;
                      });

                      it('should change the state once', () => {
                        states.length.should.eql(1);
                      });

                      it('should not report an error', () => {
                        auth.hasError(states[0]).should.be.false;
                      });

                      it('should not have error text', () => {
                        auth.getErrorText(states[0]).should.eql('');
                      });

                      it('should not be pending', () => {
                        auth.isPending(states[0]).should.be.false;
                      });

                      it('should not be signed in', () => {
                        auth.isSignedIn(states[0]).should.eql(false);
                      });

                      it('should not have a display name', () => {
                        auth.getDisplayName(states[0]).should.eql('');
                      });

                      it('should be signed out', () => {
                        auth.isSignedOut(states[0]).should.eql(true);
                      });

                      it('should not have a submitted email', () => {
                        auth.getSubmittedEmail(states[0]).should.eql('');
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
