import { $parent } from './helpers';

/**
 * Takes a view and a collection and act as the controller within them
 * 
 * @constructor
 * @param {Object} view The View Instance
 * @param {Object} collection The Collection instance
 */
export default class Controller {
   constructor(view, collection) {
       this.view = view;
       this.collection = collection;
       // Initialize events
       this._initEvents();
       // Initial list render
       this.view.listRender({ list : [] });
   }
   
   
   /**
    * Bind all possible events on view
    */
   _initEvents() {
       this.view.$input.addEventListener('keypress', (e) => {
           let val = this.view.$input.value;
           /* Prevent empty strings */
           if (!val.trim()) {
               return;
           }
           if (e.keyCode === 13) {
               this._add(val);
           }
       });
       this.view.$list.addEventListener('click', (e) => {
           let id = this.$getId(e.target);

           if (e.target.matches('.remove')) {
               this._remove(id);
           } else if (e.target.matches('.toggle')) {
               this._update(id);
           }
       });
       this.view.$infoBar.addEventListener('click', (e) => {
           //
           if (e.target.matches('#clear')) {
               this._clearCompleted();
           }
           else if (e.target.matches('#completed')) {
               this._updateViewState('completed');
           } 
           else if (e.target.matches('#active')) {
               this._updateViewState('active');
           } 
           else {
               this._updateViewState('all');
           }
       });
   }
   
   
   /**
    * Get the parent's id of a given html element
    * 
    * @param {HTMLElement} el 
    */
   $getId(el) {
       let item = $parent(el, 'li');
       return String(item.dataset.id);
   }
   
   
   /**
    * Add a particular todo
    * 
    * @param {String} title 
    */
   _add(title) {
       this.collection.set('add', title);

       this._updateView();
       this.view.clearInput();
   }
   
   
   /**
    * Remove a particlar todo
    * 
    * @param {String} id 
    */
   _remove(id) {
       this.collection.set('remove', id);
       this._updateView();
   }
   
   
   /**
    * Update a todo item
    * 
    * @param {String} id 
    */
   _update(id) {
       this.collection.set('update', id);
       this._updateView();
   }
   
   
   /**
    * Clear completed todos
    */
   _clearCompleted() {
       this.collection.set('clearCompleted');
       this._updateView();
   }
   
   
   /**
    * Changes the value of the view state
    * @param {String} val 
    */
   _updateViewState(val) {
       this.view.changeViewState(val);
       this._updateView();
   }
   
   
   /**
    * Update the view by calling view's render functions
    */
   _updateView() {
       let viewState = this.view.viewState;
       let $view = this.view;
       let state;

       if (viewState === 'all') {
           state = this.collection.get('all');
       } else if (viewState === 'completed') {
           state = this.collection.get('completed');
       } else if (viewState === 'active') {
           state = this.collection.get('active');
       }
       $view.listRender(state);
       $view.infoRender(state);
   }
}
