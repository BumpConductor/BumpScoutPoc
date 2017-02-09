import * as actions from '../../src/actions';

describe('actions', () => {
  it('should export the auth actions', () => {
    actions.auth.should.be.ok;
  });
});
