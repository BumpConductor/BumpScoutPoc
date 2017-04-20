import service from '../../../../src/ducklings/bumps/service';
import duckling from '../../../../src/ducklings/bumps';

describe('ducklings', () => {
  describe('bumps', () => {
    it('should be a collection', () => {
      duckling.is.should.eql('ducklings/collection');
    });

    it('should be associated with the service', () => {
      duckling.args.should.eql([service]);
    });
  });
});
