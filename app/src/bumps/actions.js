export const types = {
  ADD: 'ADD',
};

export const add = (id, name) => {
  return {
    type: types.ADD,
    id,
    name,
  };
};
