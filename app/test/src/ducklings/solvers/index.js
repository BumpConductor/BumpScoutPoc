import service from '../../../../src/ducklings/solvers/service';
import duckling from '../../../../src/ducklings/solvers';

describe('ducklings', () => {
  describe('solvers', () => {
    it('should be a collection', () => {
      duckling.is.should.eql('ducklings/collection');
    });

    it('should be associated with the service', () => {
      duckling.args.should.eql([service]);
    });
  });
});
