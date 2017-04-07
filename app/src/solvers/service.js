import listService from './list/service';
import addService from './add/service';

class SolversService {
  start() {
    listService.start();
    addService.start();
  }
}

export default new SolversService();
