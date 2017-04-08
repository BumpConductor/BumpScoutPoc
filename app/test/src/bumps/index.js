import * as bumps from '../../../src/bumps';
import reducer from '../../../src/bumps';

describe('bumps', () => {
  it('should export the reducer', () => {
    reducer.should.be.ok;
  });

  it('should export the list duck', () => {
    bumps.list.should.be.ok;
  });

  it('should export the add duck', () => {
    bumps.add.should.be.ok;
  });

  it('should export the completeAdd shared action', () => {
    bumps.completeAdd.should.be.ok;
  });
});
