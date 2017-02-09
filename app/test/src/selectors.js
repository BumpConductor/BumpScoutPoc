import selectors from '../../src/selectors';

describe('selectors', () => {
  it('should export the auth selectors', () => {
    selectors.auth.should.be.ok;
  });
});
