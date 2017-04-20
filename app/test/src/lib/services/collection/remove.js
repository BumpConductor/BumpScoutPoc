import Service from '../../../../../src/lib/services/collection/remove';
import firebase from 'firebase';
import {
  helpers,
} from '../../../../helpers/firebase';

const collection = 'things';
const key1 = 'a';
const entry1 = {
  data: 'entry1',
  metadata: {
    id: key1,
  },
};
const key2 = 'b';
const entry2 = {
  data: 'entry2',
  metadata: {
    id: key2,
  },
};

const initialEntries = {
  [key1]: entry1,
  [key2]: entry2,
};

const newEntries = {
  [key2]: entry2,
};

const initialData = {
  [collection]: initialEntries,
};

const newData = {
  [collection]: newEntries,
};

let service;

describe('lib', () => {
  describe('services', () => {
    describe('collection', () => {
      describe('remove', () => {
        beforeEach(async () => {
          await firebase.database().ref().set(initialData);
          service = new Service(collection);
          service.start();
        });

        describe('#submit', () => {
          it('should add remove the entry', async () => {
            await service.submit(key1).should.be.fulfilled;
            await helpers.server.getValue().should.eventually.eql(newData);
          });
        });
      });
    });
  });
});
