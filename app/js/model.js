/**
 * Create a new todo object
 * 
 * @param {Object} attrs
 */
export class Todo {
   constructor(attrs) {
       for (var attr in attrs) {
           this[attr] = attrs[attr]
       }
   }
   /**
    * Toggle the completed state of the todo
    */
   toggleCompleted() {
       this.completed = !this.completed
   }
}