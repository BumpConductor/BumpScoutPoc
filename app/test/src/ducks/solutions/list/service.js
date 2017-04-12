import service from '../../../../../src/ducks/solutions/list/service';
import firebase from 'firebase';

const key1 = 'a';
const solution1 = 'solution1';
const key2 = 'b';
const solution2 = 'solution2';

const initialSolutions = {
  [key1]: solution1,
  [key2]: solution2,
};

const initialData = {
  solutions: initialSolutions,
};

describe('solutions', () => {
  describe('list', () => {
    describe('service', () => {
      beforeEach(async () => {
        await firebase.database().ref().set(initialData);
        service.start();
      });

      describe('#fetch', () => {
        it('should resolve to the list of solutions', async () => {
          await service.fetch().should.eventually.eql(
            initialSolutions
          );
        });
      });
    });
  });
});
