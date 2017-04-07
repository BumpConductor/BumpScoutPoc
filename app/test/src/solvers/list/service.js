import service from '../../../../src/solvers/list/service';
import firebase from 'firebase';

const key1 = 'a';
const solver1 = 'solver1';
const key2 = 'b';
const solver2 = 'solver2';

const initialSolvers = {
  [key1]: solver1,
  [key2]: solver2,
};

const initialData = {
  solvers: initialSolvers,
};

describe('solvers', () => {
  describe('list', () => {
    describe('service', () => {
      beforeEach(async () => {
        await firebase.database().ref().set(initialData);
        service.start();
      });

      describe('#fetch', () => {
        it('should resolve to the list of solvers', async () => {
          await service.fetch().should.eventually.eql(
            initialSolvers
          );
        });
      });
    });
  });
});
