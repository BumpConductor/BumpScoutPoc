import combineSelectors from '../../../src/utils/combine-selectors';

const globalState = {
  group1: {
    field1: '1,1',
    field2: '1,2',
    group11: {
      field1: '1,1,1',
      field2: '1,1,2',
    },
  },
  group2: {
    field1: '2,1',
    field2: '2,2',
  },
};

const field1 = (state) => state.field1;
const field2 = (state) => state.field2;

const group11 = combineSelectors({
  field1,
  field2,
});

const group1 = combineSelectors({
  field1,
  field2,
  group11,
});

const group2 = combineSelectors({
  field1,
  field2,
});

const selectors = combineSelectors({
  group1,
  group2,
});

describe('utils', () => {
  describe('combineSelectors', () => {
    it('should combine nested collections of selectors', () => {
      selectors.group1.field1(globalState)
      .should.eql(globalState.group1.field1);
      selectors.group1.field2(globalState)
      .should.eql(globalState.group1.field2);
      selectors.group1.group11.field1(globalState)
      .should.eql(globalState.group1.group11.field1);
      selectors.group1.group11.field2(globalState)
      .should.eql(globalState.group1.group11.field2);
      selectors.group2.field1(globalState)
      .should.eql(globalState.group2.field1);
      selectors.group2.field2(globalState)
      .should.eql(globalState.group2.field2);
    });
  });
});
