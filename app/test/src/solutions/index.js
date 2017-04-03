import _ from 'lodash';
import * as solutions from '../../../src/solutions';
import reducer from '../../../src/solutions';
import solutionsService from '../../../src/solutions/service';
import ServiceHelper from '../../helpers/service';
import {
  createStore,
  applyMiddleware,
  combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

let serviceHelper;

let states;
const store = createStore(combineReducers({
  solutions: reducer,
}), applyMiddleware(thunk, promise));
store.subscribe(() => {
  states.push(store.getState());
});
async function reset({actions, serviceResults}) {
  serviceHelper.reset();
  serviceHelper.setResults(serviceResults);
  store.dispatch(solutions.reset());
  await actions.reduce(async (promise, action) => {
    await promise;
    await store.dispatch(action);
  }, Promise.resolve());
  states = [];
}

const error = new Error('FAIL');
const hash = {
  a: {
    data: 'solution1',
  },
  b: {
    data: 'solution2',
  },
};
const list = [{
  id: 'a',
  data: 'solution1',
}, {
  id: 'b',
  data: 'solution2',
}];
const key = 'c';
const data = 'solution3';

describe('solutions', () => {
  describe('with the initial state', () => {
    beforeEach(() => {
      serviceHelper = new ServiceHelper(solutionsService, [
        'getSolutions',
        'addSolution',
      ]);
      states = [
        store.getState(),
      ];
    });

    afterEach(() => {
      serviceHelper.restore();
    });

    it('should have no error', () => {
      solutions.hasError(states[0]).should.be.false;
    });

    it('should have no error text', () => {
      solutions.getErrorText(states[0]).should.eql('');
    });

    it('should not be pending', () => {
      solutions.isPending(states[0]).should.be.false;
    });

    it('should have an empty list', () => {
      solutions.getList(states[0]).should.eql([]);
    });

    it('should have no added solution', () => {
      expect(solutions.getAddedSolution(states[0])).to.be.undefined;
    });

    it('should not have an add pending', () => {
      solutions.isAddPending(states[0]).should.be.false;
    });

    it('should not have an add error', () => {
      solutions.hasAddError(states[0]).should.be.false;
    });

    it('should not have an empty add error text', () => {
      solutions.getAddErrorText(states[0]).should.eql('');
    });

    describe('then fetch solutions', () => {
      _.forEach({
        'and fail': {
          serviceResults: [{
            error: error,
          }],
          states: [{
            list: [],
            error: false,
            errorText: '',
            pending: true,
          }, {
            list: [],
            error: true,
            errorText: error.toString(),
            pending: false,
          }],
        },
        'and succeed': {
          serviceResults: [{
            success: hash,
          }],
          states: [{
            list: [],
            error: false,
            errorText: '',
            pending: true,
          }, {
            list,
            error: false,
            errorText: '',
            pending: false,
          }],
        },
      }, (resultCase, description) => {
        describe(description, () => {
          beforeEach(async () => {
            await reset({
              actions: [],
              serviceResults: resultCase.serviceResults,
            });
            await store.dispatch(solutions.fetch());
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
              beforeEach(() => {
                testState = resultCase.states[stateIndex];
                state = states[stateIndex];
              });

              it('should have the correct error state', () => {
                solutions.hasError(state).should.eql(testState.error);
              });

              it('should have the correct error text', () => {
                solutions.getErrorText(state).should.eql(testState.errorText);
              });

              it('should have the correct pending state', () => {
                solutions.isPending(state).should.eql(testState.pending);
              });

              it('should have the correct list', () => {
                solutions.getList(state).should.eql(testState.list);
              });
            });
          }
        });
      });

      describe('then add a solution to the database', () => {
        _.forEach({
          'and fail': {
            serviceResults: [{
              error: error,
            }],
            states: [{
              addPending: true,
              addError: false,
              addErrorText: '',
              addedSolution: {
                data: data,
              },
            }, {
              addPending: false,
              addError: true,
              addErrorText: error.toString(),
              addedSolution: {
                data: data,
              },
            }],
          },
          'and succeed': {
            serviceResults: [{
              success: key,
            }],
            states: [{
              addPending: true,
              addError: false,
              addErrorText: '',
              addedSolution: {
                data: data,
              },
            }, {
              addPending: false,
              addError: false,
              addErrorText: '',
              addedSolution: {
                id: key,
                data,
              },
            }],
          },
        }, (resultCase, description) => {
          describe(description, () => {
            beforeEach(async () => {
              await reset({
                actions: [solutions.fetch()],
                serviceResults: [{
                  success: hash,
                }].concat(resultCase.serviceResults),
              });
              await store.dispatch(solutions.add({data}));
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
                beforeEach(() => {
                  testState = resultCase.states[stateIndex];
                  state = states[stateIndex];
                });

                it('should not have a fetch error', () => {
                  solutions.hasError(state).should.be.false;
                });

                it('should have an empty error text', () => {
                  solutions.getErrorText(state).should.eql('');
                });

                it('should not be pending a fetch', () => {
                  solutions.isPending(state).should.be.false;
                });

                it('should have the list', () => {
                  solutions.getList(state).should.eql(list);
                });

                it('should have the correct add error state', () => {
                  solutions.hasAddError(state).should.eql(testState.addError);
                });

                it('should have the correct add error text', () => {
                  solutions.getAddErrorText(state).should.eql(
                    testState.addErrorText
                  );
                });

                it('should have the correct add pending state', () => {
                  solutions.isAddPending(state).should.eql(
                    testState.addPending
                  );
                });

                it('should have the correct added solution', () => {
                  solutions.getAddedSolution(state).should.eql(
                    testState.addedSolution
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
                solutions.fetch(),
                solutions.add({data}),
              ],
              serviceResults: [{
                success: hash,
              }, {
                success: key,
              }],
            });
            store.dispatch(solutions.completeAdd({
              id: key,
              data,
            }));
          });

          it('should not have a fetch error', () => {
            solutions.hasError(states[0]).should.be.false;
          });

          it('should have an empty error text', () => {
            solutions.getErrorText(states[0]).should.eql('');
          });

          it('should not be pending a fetch', () => {
            solutions.isPending(states[0]).should.be.false;
          });

          it('should update the list', () => {
            solutions.getList(states[0]).should.eql(list.concat([{
              id: key,
              data,
            }]));
          });

          it('should not have an add error', () => {
            solutions.hasAddError(states[0]).should.be.false;
          });

          it('should have an empty add error text', () => {
            solutions.getAddErrorText(states[0]).should.eql('');
          });

          it('should not be pending an add', () => {
            solutions.isAddPending(states[0]).should.be.false;
          });

          it('should not have an added solution', () => {
            expect(solutions.getAddedSolution(states[0])).to.be.undefined;
          });
        });
      });
    });
  });
});
