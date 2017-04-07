import service from '../../src/service';
import firebase from 'firebase';
import config from '../../config';
import authService from '../../src/auth/service';
import solutionsService from '../../src/solutions/service';
import solversService from '../../src/solvers/service';

const app = 'app';
const store = 'store';

describe('service', () => {
  beforeEach(() => {
    sinon.stub(firebase, 'initializeApp');
    sinon.stub(authService, 'start');
    sinon.stub(solutionsService, 'start');
    sinon.stub(solversService, 'start');    
    service.start(app, store);
  });

  afterEach(() => {
    firebase.initializeApp.restore();
    authService.start.restore();
    solutionsService.start.restore();
    solversService.start.restore();
  });

  it('should initialize firebase', () => {
    firebase.initializeApp.should.have.been.calledOnce;
    firebase.initializeApp.should.have.been.calledWith(config);
  });

  it('should start the auth service', () => {
    authService.start.should.have.been.calledOnce;
    authService.start.should.have.been.calledWith(
      app,
      store,
    );
  });

  it('should start the solutions service', () => {
    solutionsService.start.should.have.been.calledOnce;
  });

  it('should start the solvers service', () => {
    solversService.start.should.have.been.calledOnce;
  });
});
