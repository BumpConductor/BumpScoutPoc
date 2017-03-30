import service from '../service';
import Duck from '../duck';

const initialState = [];
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
export const reset = duck.action('RESET');
export const updateSolvers = duck.action('UPDATE_SOLVERS')

export const solversUpdate = (solvers) => (dispatch) => {
    var solverUpdates = [];
    for(const x in solvers) {
        solverUpdates.push(solvers[x]);
      }
    dispatch(updateSolvers(solverUpdates));
}
export const fetchSolvers = () => (dispatch) => {
    return service.monitorSolverUpdates();
  };

export const addSolver = (solver) => (dispatch) => {
  return service.addSolver(solver);
  };

//
// Reducer
//

export default duck.reducer({
  [reset]: () => initialState,
  [updateSolvers]: (state, action) => action.payload,
});
