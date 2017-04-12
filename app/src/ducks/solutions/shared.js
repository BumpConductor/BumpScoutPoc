import Duck from '../../lib/duck';

const duck = new Duck(
  'solutions',
);

export const completeAdd = duck.action('COMPLETE_ADD');
