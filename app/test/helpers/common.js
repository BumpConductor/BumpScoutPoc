// override the config
import './config';

// assertion styles
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sinonChaiInOrder from 'sinon-chai-in-order';
import {
  create,
} from 'forgiven';
import {
  mocha,
} from 'forgiven-mocha';
import {
  promise,
} from 'forgiven-promise';
chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(sinonChaiInOrder);
global.expect = chai.expect;
global.sinon = sinon;
global.given = create(mocha, {
  promise,
});

// helper to seed the require cache with our own exports
function seedRequireCache(name, exports) {
  const path = require.resolve(name);
  require.cache[path] = {
    id: path,
    exports: exports,
  };
}

// override firebase in the require cache
import firebase from './firebase';
seedRequireCache('firebase', firebase);
