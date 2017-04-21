import factory from '../../factory';
import asyncBehavior from '../async-behavior';

export default factory(
  'ducklings/collection/entry',
  (service) => [asyncBehavior, ({
    selector,
    app: {start, complete},
  }) => {
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
      },
      handlers: {
        [start]: () => ({
          entry: undefined,
        }),
        [complete]: {
          next: (_, {payload: entry}) => ({
            entry,
          }),
        },
      },
    };
  }],
);
