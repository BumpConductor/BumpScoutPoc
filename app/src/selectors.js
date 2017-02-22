import combineSelectors from './utils/combine-selectors';
import * as auth from './auth/selectors';
import * as bumps from './bumps/selectors';

export default combineSelectors({
  auth,
  bumps,
});
