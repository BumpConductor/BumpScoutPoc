import _ from 'lodash';
import firebase from 'firebase';

export const types = {
  BUMP_CREATE: 'BUMP_CREATE',
  BUMP_ADD_ME: 'BUMP_ADD_ME',
  BUMP_REMOVE_ME: 'BUMP_REMOVE_ME',
  BUMPS_UPDATED: 'BUMPS_UPDATED',
};

export const bumpCreate = (title, description, tags) => {
    //define new bump entry
    var bumpData = {
          creator: app.user,
          title,
          description,
          tags,
          whenCreated: firebase.database.ServerValue.TIMESTAMP,
          whenUpdated: firebase.database.ServerValue.TIMESTAMP
    };
    //Get a new firebase key to create new bump
    var newBumpKey = firebase.database().ref().child('bumps').push().key;
    //Write the new bump daa to main bumps list
    var updates = {};
    updates['/bumps/' + newBumpKey] = bumpData;
    firebase.database().ref().update(updates);
    return {
      type: types.BUMP_CREATE
      //code to create a new bump
    }
}

export const bumpAddMe = (bumpID, impactStatement, impactFrequency, impactRating) => {
  return {
    type: types.FAIL_SIGN_IN
    //code to add user to bump
  };
};

export const bumpRemoveMe = (bumpID, reason) => {
  return {
    type: types.BUMP_REMOVE_ME
    //code to remove user from bump
  };
};

export const bumpsUpdated = () => {
  return {
    type: types.BUMPS_UPDATED
    //code to notify system of changes to BUMPS
  };
};
