import service from '../../src/service';
import firebase from 'firebase';
import config from '../../config';
import authService from '../../src/ducks/auth/service';
import solutionsService from '../../src/ducks/solutions/service';
import solversService from '../../src/ducks/solvers/service';
import bumpsService from '../../src/ducks/bumps/service';

const app = 'app';
const store = 'store';

describe('service', () => {
  beforeEach(() => {
    sinon.stub(firebase, 'initializeApp');
    sinon.stub(authService, 'start');
    sinon.stub(solutionsService, 'start');
    sinon.stub(solversService, 'start');
    sinon.stub(bumpsService, 'start');
    service.start(app, store);
  });

  afterEach(() => {
    firebase.initializeApp.restore();
    authService.start.restore();
    solutionsService.start.restore();
    solversService.start.restore();
    bumpsService.start.restore();
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

  it('should start the bumps service', () => {
    bumpsService.start.should.have.been.calledOnce;
  });
});
