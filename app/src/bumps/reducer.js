import {types} from './actions';

export default function(state = {}, action) {
  switch (action.type) {
    case types.BUMP_CREATE:
      return {
        title: action.title,
        description: action.description,
        tags: action.tags,
      };
    case types.BUMP_ADD_ME:
      return {
        bumpID: action.bumpID,
        impactStatement: action.impactStatement,
        impactFrequency: action.impactFrequency,
        impactRating: action.impactRating
      };
    case types.BUMP_REMOVE_ME:
      return {
        bumpID: action.bumpID,
        removalReason: action.removalReason,
      };
    case types.BUMPS_UPDATED:
      return {
        bumps: action.bumps
      }
    default:
      return state;
  }
}
