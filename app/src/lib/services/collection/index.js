import ListService from './list';
import EntryService from './entry';
import CreateService from './create';
import UpdateService from './update';
import RemoveService from './remove';

export default class {
  constructor(collection) {
    this.list = new ListService(collection);
    this.entry = new EntryService(collection);
    this.create = new CreateService(collection);
    this.update = new UpdateService(collection);
    this.remove = new RemoveService(collection);
  }

  start() {
    this.list.start();
    this.entry.start();
    this.create.start();
    this.update.start();
    this.remove.start();
  }
}
