import _ from 'lodash';
import {
  completeAdd,
} from '../../../../../src/ducks/solutions';
import * as list from '../../../../../src/ducks/solutions/list';
import reducer from '../../../../../src/ducks/solutions/list';
import listService from '../../../../../src/ducks/solutions/list/service';
import ServiceHelper from '../../../../helpers/service';
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
  solutions: combineReducers({
    list: reducer,
  }),
}), applyMiddleware(thunk, promise));
store.subscribe(() => {
  states.push(store.getState());
});
async function reset({actions, serviceResults}) {
  serviceHelper.reset();
  serviceHelper.setResults(serviceResults);
  store.dispatch(list.reset());
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
const entries = [{
  id: 'a',
  data: 'solution1',
}, {
  id: 'b',
  data: 'solution2',
}];
const key = 'c';
const data = 'solution3';

describe('solutions', () => {
  describe('list', () => {
    describe('with the initial state', () => {
      beforeEach(() => {
        serviceHelper = new ServiceHelper(listService, {
          fetch: true,
        });
        states = [
          store.getState(),
        ];
      });

      afterEach(() => {
        serviceHelper.restore();
      });

      it('should have no error', () => {
        list.hasError(states[0]).should.be.false;
      });

      it('should have no error text', () => {
        list.getErrorText(states[0]).should.eql('');
      });

      it('should not be pending', () => {
        list.isPending(states[0]).should.be.false;
      });

      it('should have an empty entries', () => {
        list.getEntries(states[0]).should.eql([]);
      });

      describe('then fetch entries', () => {
        _.forEach({
          'and fail': {
            serviceResults: [{
              error: error,
            }],
            states: [{
              entries: [],
              error: false,
              errorText: '',
              pending: true,
            }, {
              entries: [],
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
              entries: [],
              error: false,
              errorText: '',
              pending: true,
            }, {
              entries,
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
              await store.dispatch(list.fetch());
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
                  list.hasError(state).should.eql(testState.error);
                });

                it('should have the correct error text', () => {
                  list.getErrorText(state).should.eql(testState.errorText);
                });

                it('should have the correct pending state', () => {
                  list.isPending(state).should.eql(testState.pending);
                });

                it('should have the correct entries', () => {
                  list.getEntries(state).should.eql(testState.entries);
                });
              });
            }
          });
        });

        describe('then complete an add', () => {
          beforeEach(async () => {
            await reset({
              actions: [
                list.fetch(),
              ],
              serviceResults: [{
                success: hash,
              }],
            });
            store.dispatch(completeAdd({
              id: key,
              data,
            }));
          });

          it('should not have a fetch error', () => {
            list.hasError(states[0]).should.be.false;
          });

          it('should have an empty error text', () => {
            list.getErrorText(states[0]).should.eql('');
          });

          it('should not be pending a fetch', () => {
            list.isPending(states[0]).should.be.false;
          });

          it('should update the entries', () => {
            list.getEntries(states[0]).should.eql(entries.concat([{
              id: key,
              data,
            }]));
          });
        });
      });
    });
  });
});
