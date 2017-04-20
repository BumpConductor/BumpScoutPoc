import Service from '../../../../../src/lib/services/collection';
import EntryService from '../../../../../src/lib/services/collection/entry';
import CreateService from '../../../../../src/lib/services/collection/create';
import UpdateService from '../../../../../src/lib/services/collection/update';
import RemoveService from '../../../../../src/lib/services/collection/remove';
import firebase from 'firebase';

const collection = 'things';
const key1 = 'a';
const entry1 = 'entry1';
const key2 = 'b';
const entry2 = 'entry2';

const entries = {
  [key1]: entry1,
  [key2]: entry2,
};

const noData = {
};

const data = {
  [collection]: entries,
};

let service;

describe('lib', () => {
  describe('services', () => {
    describe('collection', () => {
      beforeEach(() => {
        service = new Service(collection);
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
          sinon.stub(service.entry, 'start');
          sinon.stub(service.create, 'start');
          sinon.stub(service.update, 'start');
          sinon.stub(service.remove, 'start');
          service.start();
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

        describe('with no data', () => {
          beforeEach(async () => {
            await firebase.database().ref().set(noData);
          });

          describe('#fetch', () => {
            it('should resolve to an empty list', async () => {
              await service.fetch().should.eventually.eql([]);
            });
          });
        });

        describe('with data', () => {
          beforeEach(async () => {
            await firebase.database().ref().set(data);
          });

          describe('#fetch', () => {
            it('should resolve to the list of entries', async () => {
              await service.fetch().should.eventually.eql(
                Object.values(entries),
              );
            });
          });
        });
      });
    });
  });
});
