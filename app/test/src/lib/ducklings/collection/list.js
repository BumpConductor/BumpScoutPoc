import resolve from 'redux-duckling';
import {
  createStore,
  applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import ServiceHelper from '../../../../helpers/service';
import Service from '../../../../../src/lib/services/collection/list';

import asyncBehavior from '../../../../../src/lib/ducklings/async-behavior';
import listFactory from '../../../../../src/lib/ducklings/collection/list';

const collection = 'things';
const keyA = 'a';
const keyB = 'b';
const keyC = 'c';
const keyD = 'd';
const entryA = {
  metadata: {
    key: keyA,
  },
  data: 'item a',
};
const entryB = {
  metadata: {
    key: keyB,
  },
  data: 'item b',
};
const updatedEntryB = {
  ...entryB,
  data: 'updated b',
};
const entryC = {
  metadata: {
    key: keyC,
  },
  data: 'item c',
};
const entryD = {
  metadata: {
    key: keyD,
  },
  data: 'item d',
};
const entries = [
  entryA,
  entryB,
  entryC,
];
const createdEntries = [
  ...entries,
  entryD,
];
const updatedEntries = [
  entryA,
  updatedEntryB,
  entryC,
];
const removedEntries = [
  entryA,
  entryC,
];
const error = new Error('FAIL');

let service;
let serviceHelper;
let list;
let app;
let reducer;
let store;
let changes = [];
let initialState;

const record = (store) => (next) => (action) => {
  const result = next(action);
  changes.push({
    action,
    state: store.getState(),
  });
  return result;
};

describe('lib', () => {
  describe('ducklings', () => {
    describe('collection', () => {
      describe('list', () => {
        beforeEach(() => {
          service = new Service(collection);
          serviceHelper = new ServiceHelper(service, {
            fetch: true,
          });
          list = listFactory(service);
          ({app, reducer} = resolve(list));
          store = createStore(reducer, applyMiddleware(thunk, promise, record));
          initialState = store.getState();
        });

        it('should have the correct type string', () => {
          list.is.should.eql('ducklings/collection/list');
        });

        it('should extend asyncBehavior', () => {
          list[0].should.equal(asyncBehavior);
        });

        describe('initial state', () => {
          it('should have no entries', () => {
            app.getEntries(initialState).should.eql([]);
          });
        });

        describe('after fetch', () => {
          describe('with no error', () => {
            beforeEach(async () => {
              serviceHelper.reset();
              serviceHelper.setResults([{
                success: entries,
              }]);
              changes = [];
              await store.dispatch(app.fetch());
            });

            it('should go through the correct changes', () => {
              changes.length.should.eql(2);
              changes[0].action.type.should.eql(app.start.toString());
              app.getEntries(changes[0].state).should.eql([]);
              changes[1].action.type.should.eql(app.complete.toString());
              changes[1].action.payload.should.eql(entries);
              expect(changes[1].action.error).to.be.undefined;
              app.getEntries(changes[1].state).should.eql(entries);
            });

            describe('then fetch again', () => {
              beforeEach(async () => {
                serviceHelper.reset();
                serviceHelper.setResults([{
                  success: entries,
                }]);
                changes = [];
                await store.dispatch(app.fetch());
              });

              it('should go through the correct changes', () => {
                changes.length.should.eql(2);
                changes[0].action.type.should.eql(app.start.toString());
                app.getEntries(changes[0].state).should.eql([]);
                changes[1].action.type.should.eql(app.complete.toString());
                changes[1].action.payload.should.eql(entries);
                expect(changes[1].action.error).to.be.undefined;
                app.getEntries(changes[1].state).should.eql(entries);
              });
            });

            describe('then create', () => {
              beforeEach(() => {
                changes = [];
                store.dispatch(app.create(entryD));
              });

              it('should add the entry to the end of the list', () => {
                changes.length.should.eql(1);
                app.getEntries(changes[0].state).should.eql(createdEntries);
              });
            });

            describe('then update', () => {
              beforeEach(() => {
                changes = [];
                store.dispatch(app.update(updatedEntryB));
              });

              it('should update the entry in the list', () => {
                changes.length.should.eql(1);
                app.getEntries(changes[0].state).should.eql(updatedEntries);
              });
            });

            describe('then remove', () => {
              beforeEach(() => {
                changes = [];
                store.dispatch(app.remove(keyB));
              });

              it('should remove the entry from the list', () => {
                changes.length.should.eql(1);
                app.getEntries(changes[0].state).should.eql(removedEntries);
              });
            });
          });

          describe('with an error', () => {
            beforeEach(async () => {
              serviceHelper.reset();
              serviceHelper.setResults([{
                error,
              }]);
              changes = [];
              await store.dispatch(app.fetch());
            });

            it('should go through the correct changes', () => {
              changes.length.should.eql(2);
              changes[0].action.type.should.eql(app.start.toString());
              app.getEntries(changes[0].state).should.eql([]);
              changes[1].action.type.should.eql(app.complete.toString());
              changes[1].action.payload.should.eql(error);
              changes[1].action.error.should.be.true;
              app.getEntries(changes[1].state).should.eql([]);
            });
          });
        });
      });
    });
  });
});
