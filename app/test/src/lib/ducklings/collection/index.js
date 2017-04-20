import resolve from 'redux-duckling';
import {
  createStore,
  applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';

import Service from '../../../../../src/lib/services/collection';
import collectionFactory from '../../../../../src/lib/ducklings/collection';

const key = 'key';
const data = 'data';
const entry = {
  key,
  data,
};
const service = new Service('things');

let collection;
let app;
let reducer;
let store;
let actions = [];

const record = (_) => (next) => (action) => {
  actions.push(action);
  return next(action);
};

describe('lib', () => {
  describe('ducklings', () => {
    describe('collection', () => {
      describe('entry', () => {
        beforeEach(() => {
          collection = collectionFactory(service);
          ({app, reducer} = resolve(collection));
          store = createStore(reducer, applyMiddleware(thunk, record));
        });

        it('should have the correct type string', () => {
          collection.is.should.eql('ducklings/collection');
        });

        it('should contain the entry duckling', () => {
          collection[0].entry.is.should.eql('ducklings/collection/entry');
          collection[0].entry.args.should.eql([service.entry]);
        });

        it('should contain the list duckling', () => {
          collection[0].list.is.should.eql('ducklings/collection/list');
          collection[0].list.args.should.eql([service.list]);
        });

        it('should contain the create duckling', () => {
          collection[0].create.is.should.eql('ducklings/collection/create');
          collection[0].create.args.should.eql([service.create]);
        });

        it('should contain the update duckling', () => {
          collection[0].update.is.should.eql('ducklings/collection/update');
          collection[0].update.args.should.eql([service.update]);
        });

        it('should contain the remove duckling', () => {
          collection[0].remove.is.should.eql('ducklings/collection/remove');
          collection[0].remove.args.should.eql([service.remove]);
        });

        describe('after finalizeCreate', () => {
          beforeEach(() => {
            actions = [];
            store.dispatch(app.finalizeCreate(entry));
          });

          it('should dispatch the correct actions', () => {
            actions.length.should.eql(2);
            actions[0].type.should.eql(app.create.reset.toString());
            actions[1].type.should.eql(app.list.create.toString());
            actions[1].payload.should.eql(entry);
          });
        });

        describe('after finalizeUpdate', () => {
          beforeEach(() => {
            actions = [];
            store.dispatch(app.finalizeUpdate(entry));
          });

          it('should dispatch the correct actions', () => {
            actions.length.should.eql(3);
            actions[0].type.should.eql(app.update.reset.toString());
            actions[1].type.should.eql(app.entry.update.toString());
            actions[1].payload.should.eql(entry);
            actions[2].type.should.eql(app.list.update.toString());
            actions[2].payload.should.eql(entry);
          });
        });

        describe('after finalizeRemove', () => {
          beforeEach(() => {
            actions = [];
            store.dispatch(app.finalizeRemove(key));
          });

          it('should dispatch the correct actions', () => {
            actions.length.should.eql(2);
            actions[0].type.should.eql(app.remove.reset.toString());
            actions[1].type.should.eql(app.list.remove.toString());
            actions[1].payload.should.eql(key);
          });
        });
      });
    });
  });
});
