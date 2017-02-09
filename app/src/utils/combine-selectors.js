import _ from 'lodash';

function remap(selectors, key) {
  return _.mapValues(selectors, (selector) => {
    if (typeof selector === 'function') {
      return (state) => selector(state[key]);
    }
    return remap(selector, key);
  });
}

export default function combine(selectors) {
  return _.mapValues(selectors, (selector, key) => {
    if (typeof selector === 'function') {
      return selector;
    }
    return remap(selector, key);
  });
};
