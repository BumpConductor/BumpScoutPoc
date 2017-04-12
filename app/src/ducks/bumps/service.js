import listService from './list/service';
import addService from './add/service';

class BumpsService {
  start() {
    listService.start();
    addService.start();
  }
}

export default new BumpsService();
