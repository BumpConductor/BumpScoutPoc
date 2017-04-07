import service from '../../../src/solvers/service';
import listService from '../../../src/solvers/list/service';
import addService from '../../../src/solvers/add/service';

describe('solvers', () => {
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
