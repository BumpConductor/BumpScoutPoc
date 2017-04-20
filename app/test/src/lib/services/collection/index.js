import Service from '../../../../../src/lib/services/collection';
import ListService from '../../../../../src/lib/services/collection/list';
import EntryService from '../../../../../src/lib/services/collection/entry';
import CreateService from '../../../../../src/lib/services/collection/create';
import UpdateService from '../../../../../src/lib/services/collection/update';
import RemoveService from '../../../../../src/lib/services/collection/remove';

const collection = 'things';
let service;

describe('lib', () => {
  describe('services', () => {
    describe('collection', () => {
      beforeEach(() => {
        service = new Service(collection);
      });

      it('should export the list service', () => {
        service.list.should.be.an.instanceOf(ListService);
        service.list.collection.should.eql(collection);
      });

      it('should export the entry service', () => {
        service.entry.should.be.an.instanceOf(EntryService);
        service.entry.collection.should.eql(collection);
      });

      it('should export the create service', () => {
        service.create.should.be.an.instanceOf(CreateService);
        service.create.collection.should.eql(collection);
      });

      it('should export the update service', () => {
        service.update.should.be.an.instanceOf(UpdateService);
        service.update.collection.should.eql(collection);
      });

      it('should export the remove service', () => {
        service.remove.should.be.an.instanceOf(RemoveService);
        service.remove.collection.should.eql(collection);
      });

      describe('#start', () => {
        beforeEach(() => {
          sinon.stub(service.list, 'start');
          sinon.stub(service.entry, 'start');
          sinon.stub(service.create, 'start');
          sinon.stub(service.update, 'start');
          sinon.stub(service.remove, 'start');
          service.start();
        });

        it('should start the list service', () => {
          service.list.start.should.have.been.calledOnce;
        });

        it('should start the entry service', () => {
          service.entry.start.should.have.been.calledOnce;
        });

        it('should start the create service', () => {
          service.create.start.should.have.been.calledOnce;
        });

        it('should start the update service', () => {
          service.update.start.should.have.been.calledOnce;
        });

        it('should start the remove service', () => {
          service.remove.start.should.have.been.calledOnce;
        });
      });
    });
  });
});
