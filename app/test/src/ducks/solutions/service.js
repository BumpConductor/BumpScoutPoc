import service from '../../../../src/ducks/solutions/service';
import listService from '../../../../src/ducks/solutions/list/service';
import addService from '../../../../src/ducks/solutions/add/service';

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
