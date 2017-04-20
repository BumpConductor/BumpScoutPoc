import service from '../../../../src/ducklings/solvers/service.js';
import Service from '../../../../src/lib/services/collection';

describe('ducklings', () => {
  describe('solvers', () => {
    describe('service', () => {
      it('should be a collection service', () => {
        service.should.be.an.instanceOf(Service);
      });

      it('should be associated with the collection', () => {
        service.list.collection.should.eql('solvers');
      });
    });
  });
});
