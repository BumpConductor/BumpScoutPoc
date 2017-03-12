import Duck from '../duck';

const initialState = [{
  id: 1,
  name: 'bump 1',
}, {
  id: 2,
  name: 'bump 2',
}, {
  id: 3,
  name: 'bump 3',
}];

const duck = new Duck(
  'bumps',
  initialState,
  (state) => state.bumps
);

//
// Selectors
//
export const getList = duck.selector((state) => state);

//
// Private actions
//

//
// Public actions
//
export const reset = duck.action('RESET');
export const add = duck.action('ADD');

//
// Reducer
//
export default duck.reducer({
  [reset]: () => initialState,
  [add]: (state, action) => state.concat([{
    id: action.payload.id,
    name: action.payload.name,
  }]),
});
