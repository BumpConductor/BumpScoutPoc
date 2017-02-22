import * as selectors from '../../../src/bumps/selectors';

describe('bumps', () => {
  describe('selectors', () => {
    describe('list', () => {
      it('should return the list of bumps', () => {
        selectors.list('bumps').should.eql('bumps');
      });
    });
  });
});
