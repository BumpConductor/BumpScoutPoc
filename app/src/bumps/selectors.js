import {isUndefined} from 'lodash';
import {createSelector} from 'reselect';

const bumps = (state) => state.bumps;

export const getBUMPS = (state) => state.bumps.get("bumps");

//to be continued....