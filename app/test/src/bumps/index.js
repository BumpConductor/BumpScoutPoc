import _ from 'lodash';
import * as bumps from '../../../src/bumps';
import reducer from '../../../src/bumps';
import {
  createStore,
  combineReducers,
} from 'redux';

let states;
const store = createStore(combineReducers({
  bumps: reducer,
}));
store.subscribe(() => {
  states.push(store.getState());
});
async function reset({actions}) {
  store.dispatch(bumps.reset());
  await actions.reduce(async (promise, action) => {
    await promise;
    await store.dispatch(action);
  }, Promise.resolve());
  states = [];
}

const initialBumps = [{
  id: 1,
  name: 'bump 1',
}, {
  id: 2,
  name: 'bump 2',
}, {
  id: 3,
  name: 'bump 3',
}];
const id = 10;
const name = 'my bump';
const bump = {
  id,
  name,
};

describe('bumps', () => {
  describe('with the initial state', () => {
    before(() => {
      states = [
        store.getState(),
      ];
    });

    it('should have the initial bumps', () => {
      bumps.getList(states[0]).should.eql(initialBumps);
    });

    describe('then add', () => {
      before(async () => {
        await reset({
          actions: [],
        });
        await store.dispatch(bumps.add({
          id,
          name,
        }));
      });

      it('should add a bump', () => {
        bumps.getList(states[0]).should.eql(initialBumps.concat(bump));
      });
    });
  });
});
