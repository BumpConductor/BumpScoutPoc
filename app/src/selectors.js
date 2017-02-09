import combineSelectors from './utils/combine-selectors';
import * as auth from './auth/selectors';

export default combineSelectors({
  auth,
});
