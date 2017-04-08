import service from '../../../../src/bumps/add/service';
import firebase from 'firebase';
import {
  helpers,
} from '../../../helpers/firebase';

const key1 = 'a';
const bump1 = 'bump1';
const key2 = 'b';
const bump2 = 'bump2';

const initialBumps = {
  [key1]: bump1,
};

const newBumps = {
  [key1]: bump1,
  [key2]: bump2,
};

const initialData = {
  bumps: initialBumps,
};

const newData = {
  bumps: newBumps,
};

describe('bumps', () => {
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

        it('should add a new bump', async () => {
          await service.submit(bump2).should.eventually.eql(key2);
          await helpers.server.getValue().should.eventually.eql(newData);
        });
      });
    });
  });
});
