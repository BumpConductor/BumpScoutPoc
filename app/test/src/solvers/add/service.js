import service from '../../../../src/solvers/add/service';
import firebase from 'firebase';
import {
  helpers,
} from '../../../helpers/firebase';

const key = 'abc';
const timestamp = 123;
const uid = 'def';
const displayName = 'Fred Bloggs';
const user = {
  uid,
  displayName,
};

const key1 = 'a';
const solver1 = {
  data: 'solver1',
  metadata: {
    id: key1,
  },
};
const key2 = 'b';
const solver2 = {
  data: 'solver2',
  metadata: {
    id: key2,
  },
};

const initialSolvers = {
  [key1]: solver1,
};

const newSolvers = {
  [key1]: solver1,
  [key2]: solver2,
};

const initialData = {
  solvers: initialSolvers,
};

const newData = {
  solvers: newSolvers,
};

describe('solvers', () => {
  describe('add', () => {
    describe('service', () => {
      beforeEach(async () => {
        await firebase.database().ref().set(initialData);
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

        it('should return a new solver with metadata', () => {
          service.setMetadata({
            data: 'solver',
          }).should.eql({
            data: 'solver',
            metadata: {
              id: key,
              owner: uid,
              ownerDisplayName: displayName,
              created: timestamp,
              modified: timestamp,
            },
          });
        });
      });

      describe('#submit', () => {
        it('should add a new solver', async () => {
          await service.submit(solver2).should.be.fulfilled;
          await helpers.server.getValue().should.eventually.eql(newData);
        });
      });
    });
  });
});
