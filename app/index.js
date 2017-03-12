import 'babel-polyfill';
import * as app from './src';
import store from './src';
import {start} from './src/service';
global.app = app;
global.start = start;
global.store = store;
