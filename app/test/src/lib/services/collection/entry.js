import Service from '../../../../../src/lib/services/collection/entry';
import firebase from 'firebase';

const collection = 'things';
const key1 = 'a';
const entry1 = 'entry1';
const key2 = 'b';
const entry2 = 'entry2';

const initialEntries = {
  [key1]: entry1,
  [key2]: entry2,
};

const initialData = {
  [collection]: initialEntries,
};

let service;

describe('lib', () => {
  describe('services', () => {
    describe('collection', () => {
      describe('list', () => {
        beforeEach(async () => {
          await firebase.database().ref().set(initialData);
          service = new Service(collection);
          service.start();
        });

        describe('#get', () => {
          it('should resolve to the requested entry', async () => {
            await service.get(key2).should.eventually.eql(
              entry2,
            );
          });
        });
      });
    });
  });
});
