import {
  types,
} from './actions';

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

export default function(state = initialState, action) {
  switch (action.type) {
    case types.ADD:
      return state.concat([{
        id: action.id,
        name: action.name,
      }]);
    default:
      return state;
  }
}
