import {dispatch, spy, reset} from '../../helpers/dispatch';

import * as actions from '../../../src/bumps/actions';

const types = actions.types;
const id = 100;
const name = 'name';

describe('bumps', () => {
  describe('actions', () => {
    describe('add', () => {
      before(() => {
        reset();
        return dispatch(
          actions.add(id, name)
        );
      });

      it('should dispatch ADD', () => {
        spy.should.have.been.calledOnce;
        spy.should.have.been.calledWith({
          type: types.ADD,
          id,
          name,
        });
      });
    });
  });
});
