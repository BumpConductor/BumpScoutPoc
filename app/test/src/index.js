import * as app from '../../src/index';

describe('app', () => {
  it('should export the store', () => {
    app.store.should.be.ok;
  });

  it('should export the actions', () => {
    app.actions.should.be.ok;
  });

  it('should export the selectors', () => {
    app.selectors.should.be.ok;
  });

  it('should export the start method', () => {
    app.start.should.be.a('function');
  });
});
