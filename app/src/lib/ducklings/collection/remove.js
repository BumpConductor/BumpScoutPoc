import factory from '../../factory';
import asyncBehavior from '../async-behavior';

export default factory(
  'ducklings/collection/remove',
  (service) => [asyncBehavior, ({
    selector,
    app: {start, complete},
  }) => {
    return {
      initialState: {
        complete: false,
        key: undefined,
      },
      app: {
        getKey: selector((state) => state.key),
        isComplete: selector((state) => state.complete),
        submit: (key) => (dispatch) => {
          dispatch(start(key));
          return dispatch(complete(service.submit(key)));
        },
      },
      handlers: {
        [start]: (_, {payload: key}) => ({
          complete: false,
          key,
        }),
        [complete]: {
          next: () => ({
            complete: true,
          }),
        },
      },
    };
  }],
);
