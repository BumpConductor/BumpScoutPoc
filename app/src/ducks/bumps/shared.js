import Duck from '../../lib/duck';

const duck = new Duck(
  'bumps',
);

export const completeAdd = duck.action('COMPLETE_ADD');
