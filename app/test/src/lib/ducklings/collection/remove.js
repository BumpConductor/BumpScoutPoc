import resolve from 'redux-duckling';
import {
  createStore,
  applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import ServiceHelper from '../../../../helpers/service';
import Service from '../../../../../src/lib/services/collection/remove';

import asyncBehavior from '../../../../../src/lib/ducklings/async-behavior';
import removeFactory from '../../../../../src/lib/ducklings/collection/remove';

const collection = 'things';
const key = 'key';
const error = new Error('FAIL');

let service;
let serviceHelper;
let remove;
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
      describe('remove', () => {
        beforeEach(() => {
          service = new Service(collection);
          serviceHelper = new ServiceHelper(service, {
            submit: true,
          });
          remove = removeFactory(service);
          ({app, reducer} = resolve(remove));
          store = createStore(reducer, applyMiddleware(thunk, promise, record));
          initialState = store.getState();
        });

        afterEach(() => {
          serviceHelper.restore();
        });

        it('should have the correct type string', () => {
          remove.is.should.eql('ducklings/collection/remove');
        });

        it('should extend asyncBehavior', () => {
          remove[0].should.equal(asyncBehavior);
        });

        describe('initial state', () => {
          it('should have no key', () => {
            expect(app.getKey(initialState)).to.be.undefined;
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
                success: void 0,
              }]);
              changes = [];
              await store.dispatch(app.submit(key));
            });

            it('should submit the removal', () => {
              service.submit.should.have.been.calledWith(key);
            });

            it('should go through the correct changes', () => {
              changes.length.should.eql(2);
              changes[0].action.type.should.eql(app.start.toString());
              app.getKey(changes[0].state).should.eql(key);
              app.isComplete(changes[0].state).should.be.false;
              changes[1].action.type.should.eql(app.complete.toString());
              app.getKey(changes[1].state).should.eql(key);
              app.isComplete(changes[1].state).should.be.true;
            });

            describe('then submit again', () => {
              beforeEach(async () => {
                serviceHelper.reset();
                serviceHelper.setResults([{
                  success: void 0,
                }]);
                changes = [];
                await store.dispatch(app.submit(key));
              });

              it('should submit the removal', () => {
                service.submit.should.have.been.calledWith(key);
              });

              it('should go through the correct changes', () => {
                changes.length.should.eql(2);
                changes[0].action.type.should.eql(app.start.toString());
                app.getKey(changes[0].state).should.eql(key);
                app.isComplete(changes[0].state).should.be.false;
                changes[1].action.type.should.eql(app.complete.toString());
                app.getKey(changes[1].state).should.eql(key);
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
              await store.dispatch(app.submit(key));
            });

            it('should submit the removal', () => {
              service.submit.should.have.been.calledWith(key);
            });

            it('should go through the correct changes', () => {
              changes.length.should.eql(2);
              changes[0].action.type.should.eql(app.start.toString());
              app.getKey(changes[0].state).should.eql(key);
              app.isComplete(changes[0].state).should.be.false;
              changes[1].action.type.should.eql(app.complete.toString());
              changes[1].action.payload.should.eql(error);
              changes[1].action.error.should.be.true;
              app.getKey(changes[1].state).should.eql(key);
              app.isComplete(changes[1].state).should.be.false;
            });
          });
        });
      });
    });
  });
});
