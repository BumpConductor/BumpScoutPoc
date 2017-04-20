import * as solutions from '../../../../src/ducks/solutions';
import reducer from '../../../../src/ducks/solutions';

describe('solutions', () => {
  it('should export the reducer', () => {
    reducer.should.be.ok;
  });

  it('should export the list duck', () => {
    solutions.list.should.be.ok;
  });

  it('should export the add duck', () => {
    solutions.add.should.be.ok;
  });

  it('should export the completeAdd shared action', () => {
    solutions.completeAdd.should.be.ok;
  });
});
