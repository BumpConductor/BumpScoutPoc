import reducer from '../../../src/bumps/reducer';
import * as actions from '../../../src/bumps/actions';

describe('bumps', () => {
  describe('reducer', () => {
    it('should set the initial state to a list of bumps', () => {
      reducer(undefined, {type: '@@redux/INIT'}).should.eql([{
        id: 1,
        name: 'bump 1',
      }, {
        id: 2,
        name: 'bump 2',
      }, {
        id: 3,
        name: 'bump 3',
      }]);
    });

    describe('ADD', () => {
      it('should add a bump', () => {
        reducer(undefined, actions.add(100, 'name')).should.eql([{
          id: 1,
          name: 'bump 1',
        }, {
          id: 2,
          name: 'bump 2',
        }, {
          id: 3,
          name: 'bump 3',
        }, {
          id: 100,
          name: 'name',
        }]);
      });
    });
  });
});
