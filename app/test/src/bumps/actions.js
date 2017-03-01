import {dispatch, spy, reset} from '../../helpers/dispatch';

import * as actions from '../../../src/bumps/actions';

const types = actions.types;
const id = 100;
const name = 'name';
const description = 'bump 100';
const tags = 'one two three';

describe('bumps', () => {
  describe('actions', () => {
    describe('add', () => {
      before(() => {
        reset();
        return dispatch(
          actions.add(id, name, description, tags)
        );
      });

      it('should dispatch ADD', () => {
        spy.should.have.been.calledOnce;
        spy.should.have.been.calledWith({
          type: types.ADD,
          id,
          name,
          description,
          tags,
        });
      });
    });
  });
});
