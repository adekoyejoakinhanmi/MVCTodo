function htmlToDOM(html) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(html, "text/html");
    return doc.body.firstChild;
}

function $parent(element, tagName) {
    if (!element.parentNode) {
        return;
    }
    if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
        return element.parentNode;
    }
    return $parent(element.parentNode, tagName);
}

//===============================

class Todo {
    constructor(attrs) {
        for (var attr in attrs) {
            this[attr] = attrs[attr]
        }
    }
    toggleCompleted() {
        this.completed = !this.completed
    }
}

class TodoCollection {
    constructor() {
        /* @todo: find a way to initialize external data. */
        this.$todos = [];
    }
    /* Unique ID helper */
    cid() {
        return Math.random().toString(16).slice(2);
    }
    getById(id) {
        return this.$todos.map(t => t.id).indexOf(id);
    }
    // A default gateway for all actions possible 
    // on this collection. 
    $set(action, prop) {
        if (action === 'add') {
            this.add(prop);
        }
        if (action === 'remove') {
            this.remove(prop);
        }
        if (action === 'update') {
            this.update(prop);
        }
        if (action === 'clearCompleted') {
            this.clearComplete();
        }
    }
    add(title) {
        let thisId = this.cid();
        let todo = {
            id: thisId,
            title: title,
            completed: false
        };
        this.$todos.push(new Todo(todo));
    }
    remove(id) {
        /* Remove Object from list */
        let idx = this.getById(id);
        this.$todos.splice(idx, 1);
    }
    update(id) {
        let idx = this.getById(id);
        this.$todos[idx].toggleCompleted();
    }
    /* This mutates the internal data
     * but then I am not sure of any other
     * way to remove all completed
     */
    clearComplete() {
        let list = this.$todos;
        this.$todos = list.filter(t => !t.completed);
    }
    // A default gateway for all requests possible
    // on this collection.
    $get(req) {
        let state = {
            list : [],
            count : {
                active : this.$todos.filter(f => !f.completed).length,
                total : this.$todos.length
            }
        }
        if (req === 'all') {
            state.list = this.$todos;
        } else if (req === 'completed') {
            state.list = this.$todos.filter(t => t.completed);
        } else if (req === 'active') {
            state.list = this.$todos.filter(t => !t.completed);
        }

        return state;
    }
}

class View {
    constructor() {
        this.$viewState = 'all';
        this._listFrag = document.createDocumentFragment();
        this._infoFrag = document.createDocumentFragment();

        this.$loadDOM();
    }
    $loadDOM() {
        this.$list = document.getElementById('todo-list');
        this.$input = document.getElementById('newTodo');
        this.$infoBar = document.getElementById('info-bar');

        // This is alter to current state of UI where classList
        // contains hidden. ALso the current content should be
        // removed.
        this.$infoBar.classList.remove('hidden');
        this.$infoBar.innerHTML = '';
    }
    $todoTmpl(data) {
        let item = `
            <li data-id="${data.id}" class="${data.completed ? 'completed' : ''}">
                <input type="checkbox" class="toggle" ${data.completed ? 'checked' : ''}/>
                <span>${data.title}</span>
                <div class="pull-right btns">
                    <i class="glyphicon glyphicon-remove remove"></i>
                </div>
            </li>
        `;
        return htmlToDOM(item);
    }
    $filterTmpl(data) {
        let active = data['count']['active'];
        let state = this.$viewState;
        let hidden = data['count']['total'] <= 0 ? true : false;
        let tmpl = `
        <div class="${hidden ? 'hidden' : ''}">
            <p id="countNotifier">${active} item${active === 1 ? '' : 's'} left</p>
            <button id="all" class="btn btn-sm btn-default ${state === 'all' ? 'active' : ''}">All</button>
            <button id="completed" class="btn btn-sm btn-default ${state === 'completed' ? 'active' : ''}">
                Completed
            </button>
            <button id="active" class="btn btn-sm btn-default ${state === 'active' ? 'active' : ''}">
                Active
            </button>
            <button id="clear" class="btn pull-right btn-sm btn-danger">Clear Completed</button>
        </div>
        `;
        return htmlToDOM(tmpl);
    }
    $listHelper(item) {
        let node = this.$todoTmpl(item);
        this._listFrag.appendChild(node);
    }
    listRender(data) {
        let list = data['list'];
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
        let infoBar = this.$filterTmpl(data);

        // Update DOM
        this.$infoBar.innerHTML = '';
        this.$infoBar.appendChild(infoBar);

    }
    clearInput() {
        this.$input.value = '';
    }
    changeViewState(newState) {
        /* @todo: add validation to prevent unavailable state */
        this.$viewState = newState;
        
    }
}

class Controller {
    constructor(view, collection) {
        this.view = view;
        this.collection = collection;

        this.$events();

        // Initial list render
        this.view.listRender({ list : [] });
    }
    $events() {
        this.view.$input.addEventListener('keypress', (e) => {
            let val = this.view.$input.value;

            // Prevent empty strings
            if (!val.trim()) {
                return;
            }
            // Otherwise listen for the enter key
            // and call internal add
            if (e.keyCode === 13) {
                this._add(val);
            }
        });
        this.view.$list.addEventListener('click', (e) => {
            let id = this._getId(e.target);

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
    _add(title) {
        this.collection.$set('add', title);

        this._viewUpdate();
        this.view.clearInput();
    }
    _remove(id) {
        this.collection.$set('remove', id);
        this._viewUpdate();
    }
    _update(id) {
        this.collection.$set('update', id);
        this._viewUpdate();
    }
    _clearCompleted() {
        this.collection.$set('clearCompleted');
        this._viewUpdate();
    }
    _getId(el) {
        let item = $parent(el, 'li');
        return String(item.dataset.id);
    }
    _updateViewState(val) {
        this.view.changeViewState(val);
        this._viewUpdate();
    }
    _viewUpdate() {
        let viewState = this.view.$viewState;
        let $view = this.view;
        let state;

        if (viewState === 'all') {
            state = this.collection.$get('all');
        } else if (viewState === 'completed') {
            state = this.collection.$get('completed');
        } else if (viewState === 'active') {
            state = this.collection.$get('active');
        }

        /* @todo: send only needed data  */
        $view.listRender(state);
        $view.infoRender(state);
    }
}

window.TodoApp = new Controller(new View, new TodoCollection);