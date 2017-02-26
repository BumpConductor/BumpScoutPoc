import {
  types,
} from './actions';

const initialState = [{
  id: 1,
  name: 'bump 1',
  description: 'bump one',
  tags: 'education schools',
}, {
  id: 2,
  name: 'bump 2',
  description: 'bump two',
  tags: 'health sugar',
}, {
  id: 3,
  name: 'bump 3',
  description: 'bump three',
  tags: 'financial personal finance',
}];

export default function(state = initialState, action) {
  switch (action.type) {
    case types.ADD:
      return state.concat([{
        id: action.id,
        name: action.name,
        description: action.description,
        tags: action.tags,
      }]);
    default:
      return state;
  }
}
