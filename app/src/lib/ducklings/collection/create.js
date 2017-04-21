import factory from '../../factory';
import asyncBehavior from '../async-behavior';

export default factory(
  'ducklings/collection/create',
  (service) => [asyncBehavior, ({
    selector,
    app: {start, complete},
  }) => {
    return {
      initialState: {
        complete: false,
        entry: undefined,
      },
      app: {
        getEntry: selector((state) => state.entry),
        isComplete: selector((state) => state.complete),
        submit: (entry) => (dispatch) => {
          dispatch(start(entry));
          return dispatch(complete(service.submit(entry)));
        },
      },
      handlers: {
        [start]: (_, {payload: entry}) => ({
          complete: false,
          entry,
        }),
        [complete]: {
          next: (_, {payload: entry}) => {
            return ({
            complete: true,
            entry,
            });
          },
        },
      },
    };
  }],
);
