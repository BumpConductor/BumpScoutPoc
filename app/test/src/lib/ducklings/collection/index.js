import resolve from 'redux-duckling';
import {
  createStore,
  applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import ServiceHelper from '../../../../helpers/service';
import Service from '../../../../../src/lib/services/collection';

import asyncBehavior from '../../../../../src/lib/ducklings/async-behavior';
import collectionFactory from '../../../../../src/lib/ducklings/collection';

const namespace = 'things';
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
const updatedEntryBWithoutMetadata = {
  ...entryB,
  data: 'updated b',
};
const updatedEntryB = {
  ...updatedEntryBWithoutMetadata,
  metadata: {
    ...updatedEntryBWithoutMetadata.metadata,
    modified: 123,
  },
};
const entryC = {
  metadata: {
    key: keyC,
  },
  data: 'item c',
};
const entryDWithoutMetadata = {
  data: 'item d',
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
let collection;
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
      beforeEach(() => {
        service = new Service(namespace);
        serviceHelper = new ServiceHelper(service, {
          fetch: true,
        });
        collection = collectionFactory(service);
        ({app, reducer} = resolve(collection));
        store = createStore(reducer, applyMiddleware(thunk, promise, record));
        initialState = store.getState();
      });

      it('should have the correct type string', () => {
        collection.is.should.eql('ducklings/collection');
      });

      it('should extend asyncBehavior', () => {
        collection[0].should.equal(asyncBehavior);
      });

      it('should contain the entry duckling', () => {
        collection[1].entry.is.should.eql('ducklings/collection/entry');
        collection[1].entry.args.should.eql([service.entry]);
      });

      it('should contain the create duckling', () => {
        collection[1].create.is.should.eql('ducklings/collection/create');
        collection[1].create.args.should.eql([service.create]);
      });

      it('should contain the update duckling', () => {
        collection[1].update.is.should.eql('ducklings/collection/update');
        collection[1].update.args.should.eql([service.update]);
      });

      it('should contain the remove duckling', () => {
        collection[1].remove.is.should.eql('ducklings/collection/remove');
        collection[1].remove.args.should.eql([service.remove]);
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

          describe('then finalizeCreate', () => {
            beforeEach(async () => {
              serviceHelper = new ServiceHelper(service.create, {
                submit: true,
              });
              serviceHelper.setResults([{
                success: entryD,
              }]),
              await store.dispatch(app.create.submit(entryDWithoutMetadata));
              changes = [];
              store.dispatch(app.finalizeCreate(
                app.create.getEntry(store.getState()),
              ));
            });

            it('should update the state once', () => {
              changes.length.should.eql(1);
            });

            it('should add the entry to the end of the list', () => {
              app.getEntries(changes[0].state).should.eql(createdEntries);
            });

            it('should update the entry child', () => {
              app.entry.getEntry(changes[0].state).should.eql(entryD);
            });

            it('should reset the create operation', () => {
              app.create.isComplete(changes[0].state).should.be.false;
            });
          });

          describe('then finalizeUpdate', () => {
            beforeEach(async () => {
              serviceHelper = new ServiceHelper(service.update, {
                submit: true,
              });
              serviceHelper.setResults([{
                success: updatedEntryB,
              }]),
              await store.dispatch(app.update.submit(
                updatedEntryBWithoutMetadata,
              ));
              changes = [];
              store.dispatch(app.finalizeUpdate(
                app.update.getEntry(store.getState()),
              ));
            });

            it('should update the state once', () => {
              changes.length.should.eql(1);
            });

            it('should update the entry in the list', () => {
              app.getEntries(changes[0].state).should.eql(updatedEntries);
            });

            it('should update the entry child', () => {
              app.entry.getEntry(changes[0].state).should.eql(updatedEntryB);
            });

            it('should reset the update operation', () => {
              app.update.isComplete(changes[0].state).should.be.false;
            });
          });

          describe('then finalizeRemove', () => {
            beforeEach(async () => {
              serviceHelper = new ServiceHelper(service.remove, {
                submit: true,
              });
              serviceHelper.setResults([{
                success: void 0,
              }]),
              await store.dispatch(app.remove.submit(keyB));
              changes = [];
              store.dispatch(app.finalizeRemove(
                app.remove.getKey(store.getState()),
              ));
            });

            it('should update the state once', () => {
              changes.length.should.eql(1);
            });

            it('should remove the entry from the list', () => {
              app.getEntries(changes[0].state).should.eql(removedEntries);
            });

            it('should reset the remove operation', () => {
              app.remove.isComplete(changes[0].state).should.be.false;
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
