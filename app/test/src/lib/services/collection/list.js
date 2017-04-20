import Service from '../../../../../src/lib/services/collection/list';
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
      describe('list', () => {
        describe('with no data', () => {
          beforeEach(async () => {
            await firebase.database().ref().set(noData);
            service = new Service(collection);
            service.start();
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
            service = new Service(collection);
            service.start();
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
