import {types} from './actions';

export default function(state = {}, action) {
  switch (action.type) {
    case types.SUBMIT_SIGN_IN:
      return {
        pending: true,
        email: action.email,
      };
    case types.FAIL_SIGN_IN:
      return {
        error: action.error,
        email: state.email,
      };
    case types.SET_USER:
      const user = action.user;
      if (user === null) {
        return {};
      }
      return {
        user: action.user,
      };
    default:
      return state;
  }
}
