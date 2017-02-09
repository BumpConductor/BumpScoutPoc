// override the config
import './config';

// override firebase methods and setup spies, etc
import './firebase.js';

// assertion styles
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sinonChaiInOrder from 'sinon-chai-in-order';
chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(sinonChaiInOrder);
global.expect = chai.expect;
global.sinon = sinon;
