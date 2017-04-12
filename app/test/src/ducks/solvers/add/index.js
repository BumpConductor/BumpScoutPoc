import _ from 'lodash';
import {
  completeAdd,
} from '../../../../../src/ducks/solvers';
import * as add from '../../../../../src/ducks/solvers/add';
import reducer from '../../../../../src/ducks/solvers/add';
import addService from '../../../../../src/ducks/solvers/add/service';
import ServiceHelper from '../../../../helpers/service';
import {
  createStore,
  applyMiddleware,
  combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

let serviceHelper;

let state;
let states = [];
const store = createStore(combineReducers({
  solvers: combineReducers({
    add: reducer,
  }),
}), applyMiddleware(thunk, promise));
store.subscribe(() => {
  states.push(store.getState());
});
async function reset({actions, serviceResults}) {
  serviceHelper.reset();
  serviceHelper.setResults(serviceResults);
  store.dispatch(add.reset());
  await actions.reduce(async (promise, action) => {
    await promise;
    await store.dispatch(action);
  }, Promise.resolve());
  states = [];
}

const error = new Error('FAIL');
const solver = {
  profile: {
    name: 'new solver',
    tagline: 'Solve Cancer BUMPS',
    description: 'BUMP Solving Org',
    url: 'www.solver1.com',
    tags: 'solve cancer bumps',
  },
  contact: {
    email: 'solverTeam@solver1.com',
    name: 'solverTeam',
  },
};
const solverWithMetaData = {
  ...solver,
  metaData: {
    id: 'abc',
    creatorUID: 'def',
    creatorName: 'Fred Bloggs',
    created: 1234,
    updated: 1234,
  },
};

describe('solvers', () => {
  describe('add', () => {
    describe('with the initial state', () => {
      beforeEach(() => {
        serviceHelper = new ServiceHelper(addService, {
          submit: true,
          setMetadata: false,
        });
        state = store.getState();
      });

      afterEach(() => {
        serviceHelper.restore();
      });

      it('should have no error', () => {
        add.hasError(state).should.be.false;
      });

      it('should have no error text', () => {
        add.getErrorText(state).should.eql('');
      });

      it('should not be pending', () => {
        add.isPending(state).should.be.false;
      });

      it('should have no solver', () => {
        expect(add.getSolver(state)).to.be.undefined;
      });

      describe('then submit a new solver', () => {
        _.forEach({
          'and fail': {
            serviceResults: [{
              success: solverWithMetaData,
            }, {
              error: error,
            }],
            states: [{
              added: false,
              pending: true,
              error: false,
              errorText: '',
              solver: solverWithMetaData,
            }, {
              added: false,
              pending: false,
              error: true,
              errorText: error.toString(),
              solver: solverWithMetaData,
            }],
          },
          'and succeed': {
            serviceResults: [{
              success: solverWithMetaData,
            }, {
              success: void 0,
            }],
            states: [{
              added: false,
              pending: true,
              error: false,
              errorText: '',
              solver: solverWithMetaData,
            }, {
              added: true,
              pending: false,
              error: false,
              errorText: '',
              solver: solverWithMetaData,
            }],
          },
        }, (resultCase, description) => {
          describe(description, () => {
            beforeEach(async () => {
              await reset({
                actions: [],
                serviceResults: resultCase.serviceResults,
              });
              await store.dispatch(add.submit(solver));
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

              describe(`then state ${stateIndex}`, () => {
                beforeEach(() => {
                  testState = resultCase.states[stateIndex];
                  state = states[stateIndex];
                });

                it('should have the correct error state', () => {
                  add.hasError(state).should.eql(testState.error);
                });

                it('should have the correct error text', () => {
                  add.getErrorText(state).should.eql(
                    testState.errorText
                  );
                });

                it('should have the correct pending state', () => {
                  add.isPending(state).should.eql(
                    testState.pending
                  );
                });

                it('should have the correct added state', () => {
                  add.isAdded(state).should.eql(
                    testState.added
                  );
                });

                it('should have the correct solver', () => {
                  add.getSolver(state).should.eql(
                    testState.solver
                  );
                });
              });
            }
          });
        });

        describe('then complete the add', () => {
          beforeEach(async () => {
            await reset({
              actions: [
                add.submit(solver),
              ],
              serviceResults: [{
                success: solverWithMetaData,
              }, {
                success: void 0,
              }],
            });
            store.dispatch(completeAdd());
          });

          it('should not have an error', () => {
            add.hasError(states[0]).should.be.false;
          });

          it('should have an empty error text', () => {
            add.getErrorText(states[0]).should.eql('');
          });

          it('should not be pending', () => {
            add.isPending(states[0]).should.be.false;
          });

          it('should not be added', () => {
            add.isAdded(states[0]).should.be.false;
          });

          it('should not have a solver', () => {
            expect(add.getSolver(states[0])).to.be.undefined;
          });
        });

        describe('then reset the add', () => {
          beforeEach(async () => {
            await reset({
              actions: [
                add.submit(solver),
              ],
              serviceResults: [{
                success: solverWithMetaData,
              }, {
                error,
              }],
            });
            store.dispatch(add.reset());
          });

          it('should not have an error', () => {
            add.hasError(states[0]).should.be.false;
          });

          it('should have an empty error text', () => {
            add.getErrorText(states[0]).should.eql('');
          });

          it('should not be pending', () => {
            add.isPending(states[0]).should.be.false;
          });

          it('should not be added', () => {
            add.isAdded(states[0]).should.be.false;
          });

          it('should not have a solver', () => {
            expect(add.getSolver(states[0])).to.be.undefined;
          });
        });
      });
    });
  });
});
