import _ from 'lodash';
import * as solvers from '../../../src/solvers';
import reducer from '../../../src/solvers';
import {
  createStore,
  combineReducers,
} from 'redux';

let states;
const store = createStore(combineReducers({
  solvers: reducer,
}));
store.subscribe(() => {
  states.push(store.getState());
});
async function reset({actions}) {
  store.dispatch(solvers.reset());
  await actions.reduce(async (promise, action) => {
    await promise;
    await store.dispatch(action);
  }, Promise.resolve());
  states = [];
}

const initialSolvers = [{
  orgName: 'Solver1',
}, {
  orgName: 'Solver2',
}, {
  orgName: 'Solver3',
}];
const orgName = 'solverX';
const solver = {
  orgName,
};

describe('solvers', () => {
  describe('with the initial state', () => {
    before(() => {
      states = [
        store.getState(),
      ];
    });

    it('should have the initial solvers', () => {
      solvers.getSolvers(states[0]).should.eql(initialSolvers);
    });

    describe('then addSolver', () => {
      before(async () => {
        await reset({
          actions: [],
        });
        await store.dispatch(solvers.addSolver({
          orgName,
        }));
      });

      it('should add a solver', () => {
        solvers.getSolvers(states[0]).should.eql(initialSolvers.concat(solver));
      });
    });
  });
});
