import Duck from '../duck';

const duck = new Duck(
  'bumps',
);

export const completeAdd = duck.action('COMPLETE_ADD');
