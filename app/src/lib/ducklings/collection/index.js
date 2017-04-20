import factory from '../../factory';
import entryFactory from './entry';
import listFactory from './list';
import createFactory from './create';
import updateFactory from './update';
import removeFactory from './remove';

export default factory(
  'ducklings/collection',
  (service) => [{
    entry: entryFactory(service.entry),
    list: listFactory(service.list),
    create: createFactory(service.create),
    update: updateFactory(service.update),
    remove: removeFactory(service.remove),
  }, ({
    app: {entry, list, create, update, remove},
  }) => {
    return {
      app: {
        finalizeCreate: (createdEntry) => (dispatch) => {
          dispatch(create.reset());
          dispatch(list.create(createdEntry));
        },
        finalizeUpdate: (updatedEntry) => (dispatch) => {
          dispatch(update.reset());
          dispatch(entry.update(updatedEntry));
          dispatch(list.update(updatedEntry));
        },
        finalizeRemove: (key) => (dispatch) => {
          dispatch(remove.reset());
          dispatch(list.remove(key));
        },
      },
    };
  }],
);
