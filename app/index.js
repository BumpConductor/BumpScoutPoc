import 'babel-polyfill';
import {
  app,
  store,
} from './src';
import service from './src/service';
global.app = app;
global.store = store;
global.start = service.start;
