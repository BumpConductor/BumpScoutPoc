import {isUndefined} from 'lodash';
import {createSelector} from 'reselect';

const error = (state) => state.error;
const pending = (state) => state.pending;
const user = (state) => state.user;
const _displayName =
  (user) => isUndefined(user.displayName) ? user.email : user.displayName;
const _email = (state) =>state.email;

export const hasError = createSelector(
  error,
  (error) => !isUndefined(error),
);

export const errorText = createSelector(
  hasError,
  error,
  (hasError, error) => hasError ? error.toString() : '',
);

export const isPending = createSelector(
  pending,
  (pending) => !isUndefined(pending),
);

export const isSignedIn = createSelector(
  user,
  (user) => !isUndefined(user),
);

export const displayName = createSelector(
  isSignedIn,
  user,
  (isSignedIn, user) => isSignedIn ? _displayName(user) : '',
);

export const isSignedOut = createSelector(
  isSignedIn,
  isPending,
  (isSignedIn, isPending) => !isSignedIn && !isPending,
);

export const email = createSelector(
  _email,
  (_email) => isUndefined(_email) ? '' : _email,
);
