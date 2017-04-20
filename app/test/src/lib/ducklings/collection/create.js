import resolve from 'redux-duckling';
import {
  createStore,
  applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import ServiceHelper from '../../../../helpers/service';
import Service from '../../../../../src/lib/services/collection/create';

import asyncBehavior from '../../../../../src/lib/ducklings/async-behavior';
import createFactory from '../../../../../src/lib/ducklings/collection/create';

const collection = 'things';
const entry = 'entry';
const entryWithMetadata = 'entry with metadata';
const error = new Error('FAIL');

let service;
let serviceHelper;
let create;
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
      describe('create', () => {
        beforeEach(() => {
          service = new Service(collection);
          serviceHelper = new ServiceHelper(service, {
            setMetadata: false,
            submit: true,
          });
          create = createFactory(service);
          ({app, reducer} = resolve(create));
          store = createStore(reducer, applyMiddleware(thunk, promise, record));
          initialState = store.getState();
        });

        afterEach(() => {
          serviceHelper.restore();
        });

        it('should have the correct type string', () => {
          create.is.should.eql('ducklings/collection/create');
        });

        it('should extend asyncBehavior', () => {
          create[0].should.equal(asyncBehavior);
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
              }, {
                success: void 0,
              }]);
              changes = [];
              await store.dispatch(app.submit(entry));
            });

            it('should add metadata to the entry', () => {
              service.setMetadata.should.have.been.calledWith(entry);
            });

            it('should submit the entry', () => {
              service.submit.should.have.been.calledWith(entryWithMetadata);
            });

            it('should go through the correct changes', () => {
              changes.length.should.eql(2);
              changes[0].action.type.should.eql(app.start.toString());
              app.getEntry(changes[0].state).should.eql(entryWithMetadata);
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
                }, {
                  success: void 0,
                }]);
                changes = [];
                await store.dispatch(app.submit(entry));
              });

              it('should add metadata to the entry', () => {
                service.setMetadata.should.have.been.calledWith(entry);
              });

              it('should submit the entry', () => {
                service.submit.should.have.been.calledWith(entryWithMetadata);
              });

              it('should go through the correct changes', () => {
                changes.length.should.eql(2);
                changes[0].action.type.should.eql(app.start.toString());
                app.getEntry(changes[0].state).should.eql(entryWithMetadata);
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
                success: entryWithMetadata,
              }, {
                error,
              }]);
              changes = [];
              await store.dispatch(app.submit(entry));
            });

            it('should add metadata to the entry', () => {
              service.setMetadata.should.have.been.calledWith(entry);
            });

            it('should submit the entry', () => {
              service.submit.should.have.been.calledWith(entryWithMetadata);
            });

            it('should go through the correct changes', () => {
              changes.length.should.eql(2);
              changes[0].action.type.should.eql(app.start.toString());
              app.getEntry(changes[0].state).should.eql(entryWithMetadata);
              app.isComplete(changes[0].state).should.be.false;
              changes[1].action.type.should.eql(app.complete.toString());
              changes[1].action.payload.should.eql(error);
              changes[1].action.error.should.be.true;
              app.getEntry(changes[1].state).should.eql(entryWithMetadata);
              app.isComplete(changes[1].state).should.be.false;
            });
          });
        });
      });
    });
  });
});
