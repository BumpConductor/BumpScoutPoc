import _ from 'lodash';
import {
  completeAdd,
} from '../../../../src/solutions';
import * as add from '../../../../src/solutions/add';
import reducer from '../../../../src/solutions/add';
import addService from '../../../../src/solutions/add/service';
import ServiceHelper from '../../../helpers/service';
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
  solutions: combineReducers({
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
const key = 'a';
const data = 'solution';

describe('solutions', () => {
  describe('add', () => {
    describe('with the initial state', () => {
      beforeEach(() => {
        serviceHelper = new ServiceHelper(addService, {
          submit: true,
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

      it('should have no solution', () => {
        expect(add.getSolution(state)).to.be.undefined;
      });

      describe('then submit a new solution', () => {
        _.forEach({
          'and fail': {
            serviceResults: [{
              error: error,
            }],
            states: [{
              pending: true,
              error: false,
              errorText: '',
              solution: {
                data: data,
              },
            }, {
              pending: false,
              error: true,
              errorText: error.toString(),
              solution: {
                data: data,
              },
            }],
          },
          'and succeed': {
            serviceResults: [{
              success: key,
            }],
            states: [{
              pending: true,
              error: false,
              errorText: '',
              solution: {
                data: data,
              },
            }, {
              pending: false,
              error: false,
              errorText: '',
              solution: {
                id: key,
                data,
              },
            }],
          },
        }, (resultCase, description) => {
          describe(description, () => {
            beforeEach(async () => {
              await reset({
                actions: [],
                serviceResults: resultCase.serviceResults,
              });
              await store.dispatch(add.submit({data}));
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

                it('should have the correct solution', () => {
                  add.getSolution(state).should.eql(
                    testState.solution
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
                add.submit({data}),
              ],
              serviceResults: [{
                success: key,
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

          it('should not have a solution', () => {
            expect(add.getSolution(states[0])).to.be.undefined;
          });
        });

        describe('then reset the add', () => {
          beforeEach(async () => {
            await reset({
              actions: [
                add.submit({data}),
              ],
              serviceResults: [{
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

          it('should not have a solution', () => {
            expect(add.getSolution(states[0])).to.be.undefined;
          });
        });
      });
    });
  });
});
