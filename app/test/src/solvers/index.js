import * as solvers from '../../../src/solvers';
import reducer from '../../../src/solvers';

describe('solvers', () => {
  it('should export the reducer', () => {
    reducer.should.be.ok;
  });

  it('should export the list duck', () => {
    solvers.list.should.be.ok;
  });

  it('should export the add duck', () => {
    solvers.add.should.be.ok;
  });

  it('should export the completeAdd shared action', () => {
    solvers.completeAdd.should.be.ok;
  });
});
