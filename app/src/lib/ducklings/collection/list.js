import factory from '../../factory';
import asyncBehavior from '../async-behavior';

export default factory(
  'ducklings/collection/list',
  (service) => [asyncBehavior, ({
    action,
    selector,
    app: {start, complete},
  }) => {
    const create = action('CREATE');
    const update = action('UPDATE');
    const remove = action('REMOVE');
    return {
      initialState: {
        entries: [],
      },
      app: {
        getEntries: selector((state) => state.entries),
        fetch: () => (dispatch) => {
          dispatch(start());
          return dispatch(complete(service.fetch()));
        },
        create,
        update,
        remove,
      },
      handlers: {
        [start]: () => ({
          entries: [],
        }),
        [complete]: (_, {payload: entries, error}) => error ? {} : {
          entries,
        },
        [create]: (state, {payload: entry}) => ({
          entries: [
            ...state.entries,
            entry,
          ],
        }),
        [update]: (state, {payload: entry}) => ({
          entries: state.entries.map(
            // eslint-disable-next-line max-len
            (original) => entry.metadata.key === original.metadata.key ? entry : original,
          ),
        }),
        [remove]: (state, {payload: key}) => ({
          entries: state.entries.filter((entry) => entry.metadata.key !== key),
        }),
      },
    };
  }],
);
