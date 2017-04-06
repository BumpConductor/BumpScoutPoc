import service from '../../../../src/solutions/add/service';
import firebase from 'firebase';
import {
  helpers,
} from '../../../helpers/firebase';

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

describe('solutions', () => {
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

        it('should add a new solution', async () => {
          await service.submit(solution2).should.eventually.eql(key2);
          await helpers.server.getValue().should.eventually.eql(newData);
        });
      });
    });
  });
});
