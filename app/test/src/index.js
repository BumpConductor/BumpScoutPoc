import * as app from '../../src';
import store from '../../src';

describe('app', () => {
  it('should export the store', () => {
    store.should.be.ok;
  });

  it('should export the auth duck', () => {
    app.auth.should.be.ok;
  });

  it('should export the bumps duck', () => {
    app.bumps.should.be.ok;
  });

  it('should export the solvers duck', () => {
    app.solvers.should.be.ok;
  });

  it('should export the solutions duck', () => {
    app.solutions.should.be.ok;
  });
});
