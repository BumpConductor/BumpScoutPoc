import Service from '../../../../../src/lib/services/collection/update';
import firebase from 'firebase';
import {
  helpers,
} from '../../../../helpers/firebase';

const collection = 'things';
const key = 'abc';
const timestamp = 123;
const newTimestamp = 456;
const uid = 'def';
const displayName = 'Fred Bloggs';
const value = 'value';
const newValue = 'new value';

const entry = {
  value,
  metadata: {
    key: key,
    owner: uid,
    ownerDisplayName: displayName,
    created: timestamp,
    modified: timestamp,
  },
};

const updatedEntry = {
  ...entry,
  value: newValue,
};

const newEntry = {
  ...updatedEntry,
  metadata: {
    ...entry.metadata,
    modified: newTimestamp,
  },
};

const initialEntries = {
  [key]: entry,
};

const newEntries = {
  [key]: newEntry,
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
      describe('update', () => {
        beforeEach(async () => {
          await firebase.database().ref().set(initialData);
          service = new Service(collection);
          service.start();
        });

        describe('#setMetaData', () => {
          beforeEach(() => {
            sinon.stub(service, 'getTimestamp', () => newTimestamp);
          });

          afterEach(() => {
            service.getTimestamp.restore();
          });

          it('should return a new entry with updated metadata', () => {
            service.setMetadata(updatedEntry).should.eql(newEntry);
          });
        });

        describe('#submit', () => {
          it('should add a new entry', async () => {
            await service.submit(newEntry).should.be.fulfilled;
            await helpers.server.getValue().should.eventually.eql(newData);
          });
        });
      });
    });
  });
});
