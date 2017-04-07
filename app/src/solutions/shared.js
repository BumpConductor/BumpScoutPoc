import Duck from '../duck';

const duck = new Duck(
  'solutions',
);

export const completeAdd = duck.action('COMPLETE_ADD');
