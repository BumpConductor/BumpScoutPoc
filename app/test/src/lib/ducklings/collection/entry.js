import resolve from 'redux-duckling';
import {
  createStore,
  applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import ServiceHelper from '../../../../helpers/service';
import Service from '../../../../../src/lib/services/collection/entry';

import asyncBehavior from '../../../../../src/lib/ducklings/async-behavior';
import entryFactory from '../../../../../src/lib/ducklings/collection/entry';

const collection = 'things';
const key = 'key';
const initialEntry = {
  metadata: {
    key,
  },
  data: 'initial',
};
const updatedEntry = {
  metadata: {
    key,
  },
  data: 'updated',
};
const error = new Error('FAIL');

let service;
let serviceHelper;
let entry;
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
      describe('entry', () => {
        beforeEach(() => {
          service = new Service(collection);
          serviceHelper = new ServiceHelper(service, {
            get: true,
          });
          entry = entryFactory(service);
          ({app, reducer} = resolve(entry));
          store = createStore(reducer, applyMiddleware(thunk, promise, record));
          initialState = store.getState();
        });

        it('should have the correct type string', () => {
          entry.is.should.eql('ducklings/collection/entry');
        });

        it('should extend asyncBehavior', () => {
          entry[0].should.equal(asyncBehavior);
        });

        describe('initial state', () => {
          it('should have no entry', () => {
            expect(app.getEntry(initialState)).to.be.undefined;
          });
        });

        describe('after get', () => {
          describe('with no error', () => {
            beforeEach(async () => {
              serviceHelper.reset();
              serviceHelper.setResults([{
                success: initialEntry,
              }]);
              changes = [];
              await store.dispatch(app.get(key));
            });

            it('should call get with the key', () => {
              service.get.should.have.been.calledWith(key);
            });

            it('should go through the correct changes', () => {
              changes.length.should.eql(2);
              changes[0].action.type.should.eql(app.start.toString());
              expect(app.getEntry(changes[0].state)).to.be.undefined;
              changes[1].action.type.should.eql(app.complete.toString());
              changes[1].action.payload.should.eql(initialEntry);
              expect(changes[1].action.error).to.be.undefined;
              app.getEntry(changes[1].state).should.eql(initialEntry);
            });

            describe('then get again', () => {
              beforeEach(async () => {
                serviceHelper.reset();
                serviceHelper.setResults([{
                  success: initialEntry,
                }]);
                changes = [];
                await store.dispatch(app.get(key));
              });

              it('should call get with the key', () => {
                service.get.should.have.been.calledWith(key);
              });

              it('should go through the correct changes', () => {
                changes.length.should.eql(2);
                changes[0].action.type.should.eql(app.start.toString());
                expect(app.getEntry(changes[0].state)).to.be.undefined;
                changes[1].action.type.should.eql(app.complete.toString());
                changes[1].action.payload.should.eql(initialEntry);
                expect(changes[1].action.error).to.be.undefined;
                app.getEntry(changes[1].state).should.eql(initialEntry);
              });
            });

            describe('then update', () => {
              beforeEach(() => {
                changes = [];
                store.dispatch(app.update(updatedEntry));
              });

              it('should update the entry', () => {
                changes.length.should.eql(1);
                app.getEntry(changes[0].state).should.eql(updatedEntry);
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
              await store.dispatch(app.get(key));
            });

            it('should call get with the key', () => {
              service.get.should.have.been.calledWith(key);
            });

            it('should go through the correct changes', () => {
              changes.length.should.eql(2);
              changes[0].action.type.should.eql(app.start.toString());
              expect(app.getEntry(changes[0].state)).to.be.undefined;
              changes[1].action.type.should.eql(app.complete.toString());
              changes[1].action.payload.should.eql(error);
              changes[1].action.error.should.be.true;
              expect(app.getEntry(changes[0].state)).to.be.undefined;
            });
          });
        });
      });
    });
  });
});
