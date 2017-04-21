import Service from '../../../../../src/lib/services/collection/create';
import firebase from 'firebase';
import {
  helpers,
} from '../../../../helpers/firebase';

const collection = 'things';
const key2 = 'abc';
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
const entry2WithoutMetadata = {
  data: 'entry2',
};
const entry2 = {
  data: 'entry2',
  metadata: {
    key: key2,
    owner: uid,
    ownerDisplayName: displayName,
    created: timestamp,
    modified: timestamp,
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

        describe('#submit', () => {
          beforeEach(() => {
            helpers.auth.setCurrentUser(user);
            sinon.stub(service, 'getKey', () => key2);
            sinon.stub(service, 'getTimestamp', () => timestamp);
          });

          afterEach(() => {
            service.getKey.restore();
            service.getTimestamp.restore();
          });

          it('should add a new entry', async () => {
            await service.submit(entry2WithoutMetadata).should.eventually.eql(
              entry2,
            );
            await helpers.server.getValue().should.eventually.eql(newData);
          });
        });
      });
    });
  });
});
