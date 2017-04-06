import service from '../../../src/solutions/service';
import listService from '../../../src/solutions/list/service';
import addService from '../../../src/solutions/add/service';

describe('solutions', () => {
  describe('service', () => {
    beforeEach(() => {
      sinon.stub(listService, 'start');
      sinon.stub(addService, 'start');
      service.start();
    });

    afterEach(() => {
      listService.start.restore();
      addService.start.restore();
    });

    it('should start the list service', () => {
      listService.start.should.have.been.calledOnce;
    });

    it('should start the add service', () => {
      addService.start.should.have.been.calledOnce;
    });
  });
});
