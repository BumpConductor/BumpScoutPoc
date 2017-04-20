import Service from '../../../../../src/lib/services/collection/create';
import firebase from 'firebase';
import {
  helpers,
} from '../../../../helpers/firebase';

const collection = 'things';
const key = 'abc';
const timestamp = 123;
const uid = 'def';
const displayName = 'Fred Bloggs';
const user = {
  uid,
  displayName,
};

const key1 = 'a';
const entry1 = {
  data: 'entry1',
  metadata: {
    key: key1,
  },
};
const key2 = 'b';
const entry2 = {
  data: 'entry2',
  metadata: {
    key: key2,
  },
};

const initialEntries = {
  [key1]: entry1,
};

const newEntries = {
  [key1]: entry1,
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
      describe('create', () => {
        beforeEach(async () => {
          await firebase.database().ref().set(initialData);
          service = new Service(collection);
          service.start();
        });

        describe('#setMetaData', () => {
          beforeEach(() => {
            helpers.auth.setCurrentUser(user);
            sinon.stub(service, 'getKey', () => key);
            sinon.stub(service, 'getTimestamp', () => timestamp);
          });

          afterEach(() => {
            service.getKey.restore();
            service.getTimestamp.restore();
          });

          it('should return a new entry with metadata', () => {
            service.setMetadata({
              data: 'entry',
            }).should.eql({
              data: 'entry',
              metadata: {
                key: key,
                owner: uid,
                ownerDisplayName: displayName,
                created: timestamp,
                modified: timestamp,
              },
            });
          });
        });

        describe('#submit', () => {
          it('should add a new entry', async () => {
            await service.submit(entry2).should.be.fulfilled;
            await helpers.server.getValue().should.eventually.eql(newData);
          });
        });
      });
    });
  });
});
