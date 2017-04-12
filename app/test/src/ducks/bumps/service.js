import service from '../../../../src/ducks/bumps/service';
import listService from '../../../../src/ducks/bumps/list/service';
import addService from '../../../../src/ducks/bumps/add/service';

describe('bumps', () => {
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
