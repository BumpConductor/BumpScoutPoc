import service from '../../../../src/ducklings/solutions/service.js';
import Service from '../../../../src/lib/services/collection';

describe('ducklings', () => {
  describe('solutions', () => {
    describe('service', () => {
      it('should be a collection service', () => {
        service.should.be.an.instanceOf(Service);
      });

      it('should be associated with the collection', () => {
        service.list.collection.should.eql('solutions');
      });
    });
  });
});
