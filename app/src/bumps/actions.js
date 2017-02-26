export const types = {
  ADD: 'ADD',
};

export const add = (id, name, description, tags) => {
  return {
    type: types.ADD,
    id,
    name,
    description,
    tags,
  };
};
