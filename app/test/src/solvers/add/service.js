import service from '../../../../src/solvers/add/service';
import firebase from 'firebase';
import {
  helpers,
} from '../../../helpers/firebase';

const key1 = 'a';
const solver1 = 'solver1';
const key2 = 'b';
const solver2 = 'solver2';

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

      describe('#submit', () => {
        beforeEach(() => {
          sinon.stub(service, 'getKey', () => key2);
        });

        afterEach(() => {
          service.getKey.restore();
        });

        it('should add a new solver', async () => {
          await service.submit(solver2).should.eventually.eql(key2);
          await helpers.server.getValue().should.eventually.eql(newData);
        });
      });
    });
  });
});
