import service from '../../../../src/ducklings/solutions/service';
import duckling from '../../../../src/ducklings/solutions';

describe('ducklings', () => {
  describe('solutions', () => {
    it('should be a collection', () => {
      duckling.is.should.eql('ducklings/collection');
    });

    it('should be associated with the service', () => {
      duckling.args.should.eql([service]);
    });
  });
});
