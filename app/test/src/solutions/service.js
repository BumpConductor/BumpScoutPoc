import solutionsService from '../../../src/solutions/service';
import firebase from 'firebase';
import {
  helpers,
} from '../../helpers/firebase';

const key1 = 'a';
const solution1 = 'solution1';
const key2 = 'b';
const solution2 = 'solution2';

const initialSolutions = {
  [key1]: solution1,
};

const newSolutions = {
  [key1]: solution1,
  [key2]: solution2,
};

const initialData = {
  solutions: initialSolutions,
};

const newData = {
  solutions: newSolutions,
};

describe('solutionsService', () => {
  beforeEach(async () => {
    await firebase.database().ref().set(initialData);
    solutionsService.start();
  });

  describe('#getSolutions', () => {
    it('should resolve to the list of solutions', async () => {
      await solutionsService.getSolutions().should.eventually.eql(
        initialSolutions
      );
    });
  });

  describe('#addSolution', () => {
    beforeEach(() => {
      sinon.stub(solutionsService, 'getKey', () => key2);
    });

    afterEach(() => {
      solutionsService.getKey.restore();
    });

    it('should add a new solution', async () => {
      await solutionsService.addSolution(solution2).should.eventually.eql(key2);
      console.log('after update');
      await helpers.server.getValue().should.eventually.eql(newData);
    });
  });
});
