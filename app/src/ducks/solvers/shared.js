import Duck from '../../lib/duck';

const duck = new Duck(
  'solvers',
);

export const completeAdd = duck.action('COMPLETE_ADD');
