import Duck from '../duck';

const initialState = [{
  orgName: 'Solver1',
}, {
  orgName: 'Solver2',
}, {
  orgName: 'Solver3',
}];

const duck = new Duck(
  'solvers',
  initialState,
  (state) => state.solvers
);

//
// Selectors
//
export const getSolvers = duck.selector((state) => state);

//
// Private actions
//

//
// Public actions
//
export const reset = duck.action('RESET_SOLVERS');
export const addSolver = duck.action('ADD_SOLVER');

//
// Reducer
//
export default duck.reducer({
  [reset]: () => initialState,
  [addSolver]: (state, action) => state.concat([{
    orgName: action.payload.orgName,
  }]),
});
