import listService from './list/service';
import addService from './add/service';

class SolutionsService {
  start() {
    listService.start();
    addService.start();
  }
}

export default new SolutionsService();
