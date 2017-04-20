import {
  app,
  store,
} from '../../src';

describe('app', () => {
  it('should export the store', () => {
    store.should.be.ok;
  });

  it('should export the error duckling', () => {
    app.error.should.be.ok;
  });

  it('should export the auth duckling', () => {
    app.auth.should.be.ok;
  });

  it('should export the bumps duckling', () => {
    app.bumps.should.be.ok;
  });

  it('should export the solvers duckling', () => {
    app.solvers.should.be.ok;
  });

  it('should export the solutions duckling', () => {
    app.solutions.should.be.ok;
  });
});
