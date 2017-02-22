import {combineReducers} from 'redux';
import auth from './auth/reducer';
import bumps from './bumps/reducer';
export default combineReducers({
  auth,
  bumps,
});
