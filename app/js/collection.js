import Todo from './model';

/**
 * Creates a new collection to manage the todo list
 */
export default class TodoCollection {
   constructor() {
       this.todos = [];
   }
   /**
    * ID helper of this collection
    */
   $cid() {
       return Math.random().toString(16).slice(2);
   }
   /**
    * Finds the index of a given todo in the collection
    * based on the internal id of the todo
    * 
    * @param {String} id 
    */
   $getById(id) {
       return this.todos.map(t => t.id).indexOf(id);
   }
   /**
    * Adds a new todo to the collection
    * 
    * @param {String} title 
    */
   _add(title) {
       let thisId = this.$cid();
       let todo = {
           id: thisId,
           title: title,
           completed: false
       };
       this.todos.push(new Todo(todo));
   }
   /**
    * Removes a todo from the collection based on 
    * given id
    * 
    * @param {String} id 
    */
   _remove(id) {
       let idx = this.$getById(id);
       this.todos.splice(idx, 1);
   }
   /**
    * Updates the completed state of a todo in the collection
    * 
    * @param {String} id 
    */
   _update(id) {
       let idx = this.$getById(id);
       this.todos[idx].toggleCompleted();
   }
   /**
    * Filters the collection for completed items
    */
   _clearComplete() {
       let list = this.$todos;
       this.todos = list.filter(t => !t.completed);
   }
   /**
    * Gives access to retrive data from the collection 
    * based on req
    * 
    * @param {String} req 
    * @returns {Object} state which represents all possible 
    * data from this collection
    */
   get(req) {
       let activeList = this.todos.filter(t => !t.completed);
       let completedList = this.todos.filter(t => t.completed);

       let state = {
           list : [],
           count : {
               active : activeList.length,
               total : this.todos.length,
               completed : completedList.length
           }
       }
       if (req === 'all') {
           state.list = this.todos;
       } else if (req === 'completed') {
           state.list = completedList
       } else if (req === 'active') {
           state.list = activeList
       }

       return state;
   }
   /**
    * Provides a way to perform actions on the collection.
    * 
    * @param {String} action The name of the action to be performed
    * @param {String|Object} prop The data to perform the action with
    * 
    * @example
    * set('add', {todo}) // Will add a new todo to the collection
    * set('remove', todoId) // Will remove the todo with the given todoId 
    * set('update', todoId) // Will update the todo with the given todoId
    * set('clearCompleted') // Will remove completed todos
    */
   set(action, prop) {
       if (action === 'add') {
           this._add(prop);
       }
       if (action === 'remove') {
           this._remove(prop);
       }
       if (action === 'update') {
           this._update(prop);
       }
       if (action === 'clearCompleted') {
           this._clearComplete();
       }
   }
}