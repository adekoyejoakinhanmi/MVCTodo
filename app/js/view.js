import { htmlToDOM } from './helpers';

/**
 * View that deals with DOM. It provides two
 * render functions.
 *  1. ListRender -> which renders the list using a HTML document frag
 *                   to implement faster renders
 *  2. InfoRender -> which renders the info bar
 */
export class View {
   constructor() {
       this.viewState = 'all';
       this._listFrag = document.createDocumentFragment();

       this._loadDOM();
   }
   /**
    * Load the DOM
    */
   _loadDOM() {
       this.$list = document.getElementById('todo-list');
       this.$input = document.getElementById('newTodo');
       this.$infoBar = document.getElementById('info-bar');

       // This is alter to current state of UI where classList
       // contains hidden. ALso the current content should be
       // removed.
       this.$infoBar.classList.remove('hidden');
       this.$infoBar.innerHTML = '';
   }
   /**
    * Todo Item template
    * @param {Object} param0 Destructures todo object
    * @returns {HTMLElement} 
    */
   $todoTmpl({id, title, completed}) {
       let item = `
           <li data-id="${id}" class="${completed ? 'completed' : ''}">
               <input type="checkbox" class="toggle" ${completed ? 'checked' : ''}/>
               <span>${title}</span>
               <div class="pull-right btns">
                   <i class="glyphicon glyphicon-trash remove"></i>
               </div>
           </li>
       `;
       return htmlToDOM(item);
   }
   /**
    * Info bar template
    * @param {Object} param0 Destructes count object from given state object 
    */
   $infoTmpl({ count : { active : a, total : t, completed : c} }) {
       let hidden = t <= 0 ? true : false;
       let state = this.viewState;
       
       let tmpl = `
       <div class="${hidden ? 'hidden' : ''}">
           <p id="countNotifier">${a} item${a === 1 ? '' : 's'} left</p>
           <button id="all" class="btn btn-sm btn-default ${state === 'all' ? 'active' : ''}">All</button>
           <button id="completed" class="btn btn-sm btn-default ${state === 'completed' ? 'active' : ''}">
               Completed
           </button>
           <button id="active" class="btn btn-sm btn-default ${state === 'active' ? 'active' : ''}">
               Active
           </button>
           <button id="clear" class="btn pull-right btn-sm btn-danger ${c <= 0 ? 'disabled' : ''}">Clear Completed</button>
       </div>
       `;
       return htmlToDOM(tmpl);
   }
   /**
    * Helps the list render function
    * 
    * @param {Object} item todo data to be render
    */
   $listHelper(item) {
       let node = this.$todoTmpl(item);
       this._listFrag.appendChild(node);
   }
   /**
    * Render list
    * @param {Object} param0 Destructures list object from given state
    */
   listRender({ list }) {
       // Clear this list
       this._listFrag.innerHTML = '';
       // If data passed is empty update accordingly
       if (!list || list.length === 0) {
           let p = document.createElement('p');
           p.className = 'text-center';
           p.innerText = 'Nothing to see here';
           this._listFrag.appendChild(p);
       }
       // Otherwise insert nodes for each data into frag
       else {
           for (var i = 0, l = list.length; i < l; i++) {
               this.$listHelper(list[i]);
           }
       }
       // Finally, update DOM with frag list
       this.$list.innerHTML = '';
       this.$list.appendChild(this._listFrag);
   }
   infoRender(data) {
       let infoBar = this.$infoTmpl(data);
       // Update DOM
       this.$infoBar.innerHTML = '';
       this.$infoBar.appendChild(infoBar);

   }
   clearInput() {
       this.$input.value = '';
   }
   /**
    * Changes view state 
    * @param {String} newState 
    */
   changeViewState(newState) {
       this.viewState = newState;  
   }
}
