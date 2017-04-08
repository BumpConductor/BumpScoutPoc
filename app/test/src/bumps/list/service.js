import service from '../../../../src/bumps/list/service';
import firebase from 'firebase';

const key1 = 'a';
const bump1 = 'bump1';
const key2 = 'b';
const bump2 = 'bump2';

const initialBumps = {
  [key1]: bump1,
  [key2]: bump2,
};

const initialData = {
  bumps: initialBumps,
};

describe('bumps', () => {
  describe('list', () => {
    describe('service', () => {
      beforeEach(async () => {
        await firebase.database().ref().set(initialData);
        service.start();
      });

      describe('#fetch', () => {
        it('should resolve to the list of bumps', async () => {
          await service.fetch().should.eventually.eql(
            initialBumps
          );
        });
      });
    });
  });
});
