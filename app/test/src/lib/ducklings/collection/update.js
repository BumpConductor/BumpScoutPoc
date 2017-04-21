import resolve from 'redux-duckling';
import {
  createStore,
  applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import ServiceHelper from '../../../../helpers/service';
import Service from '../../../../../src/lib/services/collection/update';

import asyncBehavior from '../../../../../src/lib/ducklings/async-behavior';
import createFactory from '../../../../../src/lib/ducklings/collection/update';

const collection = 'things';
const entry = 'entry';
const entryWithMetadata = 'entry with metadata';
const error = new Error('FAIL');

let service;
let serviceHelper;
let update;
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
      describe('update', () => {
        beforeEach(() => {
          service = new Service(collection);
          serviceHelper = new ServiceHelper(service, {
            submit: true,
          });
          update = createFactory(service);
          ({app, reducer} = resolve(update));
          store = createStore(reducer, applyMiddleware(thunk, promise, record));
          initialState = store.getState();
        });

        afterEach(() => {
          serviceHelper.restore();
        });

        it('should have the correct type string', () => {
          update.is.should.eql('ducklings/collection/update');
        });

        it('should extend asyncBehavior', () => {
          update[0].should.equal(asyncBehavior);
        });

        describe('initial state', () => {
          it('should have no entry', () => {
            expect(app.getEntry(initialState)).to.be.undefined;
          });

          it('should not be complete', () => {
            app.isComplete(initialState).should.be.false;
          });
        });

        describe('after submit', () => {
          describe('with no error', () => {
            beforeEach(async () => {
              serviceHelper.reset();
              serviceHelper.setResults([{
                success: entryWithMetadata,
              }]);
              changes = [];
              await store.dispatch(app.submit(entry));
            });

            it('should submit the entry', () => {
              service.submit.should.have.been.calledWith(entry);
            });

            it('should go through the correct changes', () => {
              changes.length.should.eql(2);
              changes[0].action.type.should.eql(app.start.toString());
              app.getEntry(changes[0].state).should.eql(entry);
              app.isComplete(changes[0].state).should.be.false;
              changes[1].action.type.should.eql(app.complete.toString());
              app.getEntry(changes[1].state).should.eql(entryWithMetadata);
              app.isComplete(changes[1].state).should.be.true;
            });

            describe('then submit again', () => {
              beforeEach(async () => {
                serviceHelper.reset();
                serviceHelper.setResults([{
                  success: entryWithMetadata,
                }]);
                changes = [];
                await store.dispatch(app.submit(entry));
              });

              it('should submit the entry', () => {
                service.submit.should.have.been.calledWith(entry);
              });

              it('should go through the correct changes', () => {
                changes.length.should.eql(2);
                changes[0].action.type.should.eql(app.start.toString());
                app.getEntry(changes[0].state).should.eql(entry);
                app.isComplete(changes[0].state).should.be.false;
                changes[1].action.type.should.eql(app.complete.toString());
                app.getEntry(changes[1].state).should.eql(entryWithMetadata);
                app.isComplete(changes[1].state).should.be.true;
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
              await store.dispatch(app.submit(entry));
            });

            it('should submit the entry', () => {
              service.submit.should.have.been.calledWith(entry);
            });

            it('should go through the correct changes', () => {
              changes.length.should.eql(2);
              changes[0].action.type.should.eql(app.start.toString());
              app.getEntry(changes[0].state).should.eql(entry);
              app.isComplete(changes[0].state).should.be.false;
              changes[1].action.type.should.eql(app.complete.toString());
              changes[1].action.payload.should.eql(error);
              changes[1].action.error.should.be.true;
              app.getEntry(changes[1].state).should.eql(entry);
              app.isComplete(changes[1].state).should.be.false;
            });
          });
        });
      });
    });
  });
});
