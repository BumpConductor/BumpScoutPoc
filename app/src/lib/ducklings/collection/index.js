import factory from '../../factory';
import asyncBehavior from '../async-behavior';
import entryFactory from './entry';
import createFactory from './create';
import updateFactory from './update';
import removeFactory from './remove';

export default factory(
  'ducklings/collection',
  (service) => [asyncBehavior, {
    entry: entryFactory(service.entry),
    create: createFactory(service.create),
    update: updateFactory(service.update),
    remove: removeFactory(service.remove),
  }, ({
    action,
    selector,
    reduce,
    app: {start, complete},
  }) => {
    const finalizeCreate = action('FINALIZE_CREATE');
    const finalizeUpdate = action('FINALIZE_UPDATE');
    const finalizeRemove = action('FINALIZE_REMOVE');
    return {
      initialState: {
        entries: [],
      },
      handlers: {
        [start]: () => ({
          entries: [],
        }),
        [complete]: {
          next: (_, {payload: entries}) => ({
            entries,
          }),
        },
        [finalizeCreate]: (state, {payload: entry}) => ({
          ...reduce(state, {
            create: [['reset']],
          }),
          entries: [
            ...state.entries,
            entry,
          ],
        }),
        [finalizeUpdate]: (state, {payload: entry}) => ({
          ...reduce(state, {
            update: [['reset']],
            entry: [['update', entry]],
          }),
          entries: state.entries.map(
            // eslint-disable-next-line max-len
            (original) => entry.metadata.key === original.metadata.key ? entry : original,
          ),
        }),
        [finalizeRemove]: (state, {payload: key}) => ({
          ...reduce(state, {
            remove: [['reset']],
          }),
          entries: state.entries.filter((entry) => entry.metadata.key !== key),
        }),
      },
      app: {
        getEntries: selector((state) => state.entries),
        fetch: () => (dispatch) => {
          dispatch(start());
          return dispatch(complete(service.fetch()));
        },
        finalizeCreate,
        finalizeUpdate,
        finalizeRemove,
      },
    };
  }],
);
