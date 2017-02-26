import reducer from '../../../src/bumps/reducer';
import * as actions from '../../../src/bumps/actions';

describe('bumps', () => {
  describe('reducer', () => {
    it('should set the initial state to a list of bumps', () => {
      reducer(undefined, {type: '@@redux/INIT'}).should.eql([{
        id: 1,
        name: 'bump 1',
        description: 'bump one',
        tags: 'education schools',
      }, {
        id: 2,
        name: 'bump 2',
        description: 'bump two',
        tags: 'health sugar',
      }, {
        id: 3,
        name: 'bump 3',
        description: 'bump three',
        tags: 'financial personal finance',
      }]);
    });

    describe('ADD', () => {
      it('should add a bump', () => {
        reducer(undefined, actions.add(
          100, 'name', 'bump 100', 'one two three')).should.eql([{
          id: 1,
          name: 'bump 1',
          description: 'bump one',
          tags: 'education schools',
        }, {
          id: 2,
          name: 'bump 2',
          description: 'bump two',
          tags: 'health sugar',
        }, {
          id: 3,
          name: 'bump 3',
          description: 'bump three',
          tags: 'financial personal finance',
        }, {
          id: 100,
          name: 'name',
          description: 'bump 100',
          tags: 'one two three',
        }]);
      });
    });
  });
});
