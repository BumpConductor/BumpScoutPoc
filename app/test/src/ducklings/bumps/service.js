import service from '../../../../src/ducklings/bumps/service.js';
import Service from '../../../../src/lib/services/collection';

describe('ducklings', () => {
  describe('bumps', () => {
    describe('service', () => {
      it('should be a collection service', () => {
        service.should.be.an.instanceOf(Service);
      });

      it('should be associated with the collection', () => {
        service.collection.should.eql('bumps');
      });
    });
  });
});
