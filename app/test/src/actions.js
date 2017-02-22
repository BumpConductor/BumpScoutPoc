import * as actions from '../../src/actions';

describe('actions', () => {
  it('should export the auth actions', () => {
    actions.auth.should.be.ok;
  });

  it('should export the bumps actions', () => {
    actions.bumps.should.be.ok;
  });
});
