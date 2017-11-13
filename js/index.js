

/**
 * Will return DOM node from given string
 * 
 * @param {String} html 
 */
function htmlToDOM(html) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(html, "text/html");
    return doc.body.firstChild;
}

/**
 * Find and return the parent node of a given
 * tag
 * 
 * @param {HTMLElement} element 
 * @param {String} tagName 
 */

function $parent(element, tagName) {
    if (!element.parentNode) {
        return;
    }
    if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
        return element.parentNode;
    }
    return $parent(element.parentNode, tagName);
}


/**
 * Create a new todo object
 * 
 * @param {Object} attrs
 */
class Todo {
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

/**
 * Creates a new collection to manage the todo list
 */
class TodoCollection {
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

/**
 * View that deals with DOM. It provides two
 * render functions.
 *  1. ListRender -> which renders the list using a HTML document frag
 *                   to implement faster renders
 *  2. InfoRender -> which renders the info bar
 */
class View {
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
/**
 * Takes a view and a collection and act as the controller within them
 * 
 * @constructor
 * @param {Object} view The View Instance
 * @param {Object} collection The Collection instance
 */
class Controller {
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
        })
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

window.TodoApp = new Controller(new View, new TodoCollection);