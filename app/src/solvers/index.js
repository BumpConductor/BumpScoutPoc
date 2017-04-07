import {
  combineReducers,
} from 'redux';

// we do this using a shared library
// of selectors and actions to prevent
// a circular reference
import {
  completeAdd,
} from './shared';
export {completeAdd};

import listReducer from './list';
import * as list from './list';
export {list};

import addReducer from './add';
import * as add from './add';
export {add};

export default combineReducers({
  list: listReducer,
  add: addReducer,
});
