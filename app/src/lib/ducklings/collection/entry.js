import factory from '../../factory';
import asyncBehavior from '../async-behavior';

export default factory(
  'ducklings/collection/entry',
  (service) => [asyncBehavior, ({
    action,
    selector,
    app: {start, complete},
  }) => {
    const update = action('UPDATE');
    return {
      initialState: {
        entry: undefined,
      },
      app: {
        getEntry: selector((state) => state.entry),
        get: (key) => (dispatch) => {
          dispatch(start());
          return dispatch(complete(service.get(key)));
        },
        update,
      },
      handlers: {
        [start]: () => ({
          entry: undefined,
        }),
        [complete]: (_, {payload: entry, error}) => error ? {} : {
          entry,
        },
        [update]: (state, {payload: entry}) => ({
          entry,
        }),
      },
    };
  }],
);
