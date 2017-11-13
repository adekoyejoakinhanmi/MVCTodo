import Collection from './collection';
import View from './view';
import Controller from './controller';

const view = new View();
const collection = new Collection();

new Controller(view, collection);