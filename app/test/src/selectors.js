import selectors from '../../src/selectors';

describe('selectors', () => {
  it('should export the auth selectors', () => {
    selectors.auth.should.be.ok;
  });

  it('should export the bumps selectors', () => {
    selectors.bumps.should.be.ok;
  });
});
