/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.$parent = $parent;
exports.htmlToDOM = htmlToDOM;

/**
 * Will return DOM node from given string
 * 
 * @param {String} html 
 */

function htmlToDOM(html) {
   var parser = new DOMParser();
   var doc = parser.parseFromString(html, "text/html");
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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _collection = __webpack_require__(2);

var _collection2 = _interopRequireDefault(_collection);

var _view = __webpack_require__(4);

var _view2 = _interopRequireDefault(_view);

var _controller = __webpack_require__(5);

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var view = new _view2.default();
var collection = new _collection2.default();

new _controller2.default(view, collection);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _model = __webpack_require__(3);

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Creates a new collection to manage the todo list
 */
var TodoCollection = function () {
    function TodoCollection() {
        _classCallCheck(this, TodoCollection);

        this.todos = [];
    }
    /**
     * ID helper of this collection
     */


    _createClass(TodoCollection, [{
        key: '$cid',
        value: function $cid() {
            return Math.random().toString(16).slice(2);
        }
        /**
         * Finds the index of a given todo in the collection
         * based on the internal id of the todo
         * 
         * @param {String} id 
         */

    }, {
        key: '$getById',
        value: function $getById(id) {
            return this.todos.map(function (t) {
                return t.id;
            }).indexOf(id);
        }
        /**
         * Adds a new todo to the collection
         * 
         * @param {String} title 
         */

    }, {
        key: '_add',
        value: function _add(title) {
            var thisId = this.$cid();
            var todo = {
                id: thisId,
                title: title,
                completed: false
            };
            this.todos.push(new _model2.default(todo));
        }
        /**
         * Removes a todo from the collection based on 
         * given id
         * 
         * @param {String} id 
         */

    }, {
        key: '_remove',
        value: function _remove(id) {
            var idx = this.$getById(id);
            this.todos.splice(idx, 1);
        }
        /**
         * Updates the completed state of a todo in the collection
         * 
         * @param {String} id 
         */

    }, {
        key: '_update',
        value: function _update(id) {
            var idx = this.$getById(id);
            this.todos[idx].toggleCompleted();
        }
        /**
         * Filters the collection for completed items
         */

    }, {
        key: '_clearComplete',
        value: function _clearComplete() {
            var list = this.$todos;
            this.todos = list.filter(function (t) {
                return !t.completed;
            });
        }
        /**
         * Gives access to retrive data from the collection 
         * based on req
         * 
         * @param {String} req 
         * @returns {Object} state which represents all possible 
         * data from this collection
         */

    }, {
        key: 'get',
        value: function get(req) {
            var activeList = this.todos.filter(function (t) {
                return !t.completed;
            });
            var completedList = this.todos.filter(function (t) {
                return t.completed;
            });

            var state = {
                list: [],
                count: {
                    active: activeList.length,
                    total: this.todos.length,
                    completed: completedList.length
                }
            };
            if (req === 'all') {
                state.list = this.todos;
            } else if (req === 'completed') {
                state.list = completedList;
            } else if (req === 'active') {
                state.list = activeList;
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

    }, {
        key: 'set',
        value: function set(action, prop) {
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
    }]);

    return TodoCollection;
}();

exports.default = TodoCollection;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Create a new todo object
 * 
 * @param {Object} attrs
 */
var Todo = function () {
    function Todo(attrs) {
        _classCallCheck(this, Todo);

        for (var attr in attrs) {
            this[attr] = attrs[attr];
        }
    }
    /**
     * Toggle the completed state of the todo
     */


    _createClass(Todo, [{
        key: "toggleCompleted",
        value: function toggleCompleted() {
            this.completed = !this.completed;
        }
    }]);

    return Todo;
}();

exports.default = Todo;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * View that deals with DOM. It provides two
 * render functions.
 *  1. ListRender -> which renders the list using a HTML document frag
 *                   to implement faster renders
 *  2. InfoRender -> which renders the info bar
 */
var View = function () {
    function View() {
        _classCallCheck(this, View);

        this.viewState = 'all';
        this._listFrag = document.createDocumentFragment();

        this._loadDOM();
    }
    /**
     * Load the DOM
     */


    _createClass(View, [{
        key: '_loadDOM',
        value: function _loadDOM() {
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

    }, {
        key: '$todoTmpl',
        value: function $todoTmpl(_ref) {
            var id = _ref.id,
                title = _ref.title,
                completed = _ref.completed;

            var item = '\n           <li data-id="' + id + '" class="' + (completed ? 'completed' : '') + '">\n               <input type="checkbox" class="toggle" ' + (completed ? 'checked' : '') + '/>\n               <span>' + title + '</span>\n               <div class="pull-right btns">\n                   <i class="glyphicon glyphicon-trash remove"></i>\n               </div>\n           </li>\n       ';
            return (0, _helpers.htmlToDOM)(item);
        }
        /**
         * Info bar template
         * @param {Object} param0 Destructes count object from given state object 
         */

    }, {
        key: '$infoTmpl',
        value: function $infoTmpl(_ref2) {
            var _ref2$count = _ref2.count,
                a = _ref2$count.active,
                t = _ref2$count.total,
                c = _ref2$count.completed;

            var hidden = t <= 0 ? true : false;
            var state = this.viewState;

            var tmpl = '\n       <div class="' + (hidden ? 'hidden' : '') + '">\n           <p id="countNotifier">' + a + ' item' + (a === 1 ? '' : 's') + ' left</p>\n           <button id="all" class="btn btn-sm btn-default ' + (state === 'all' ? 'active' : '') + '">All</button>\n           <button id="completed" class="btn btn-sm btn-default ' + (state === 'completed' ? 'active' : '') + '">\n               Completed\n           </button>\n           <button id="active" class="btn btn-sm btn-default ' + (state === 'active' ? 'active' : '') + '">\n               Active\n           </button>\n           <button id="clear" class="btn pull-right btn-sm btn-danger ' + (c <= 0 ? 'disabled' : '') + '">Clear Completed</button>\n       </div>\n       ';
            return (0, _helpers.htmlToDOM)(tmpl);
        }
        /**
         * Helps the list render function
         * 
         * @param {Object} item todo data to be render
         */

    }, {
        key: '$listHelper',
        value: function $listHelper(item) {
            var node = this.$todoTmpl(item);
            this._listFrag.appendChild(node);
        }
        /**
         * Render list
         * @param {Object} param0 Destructures list object from given state
         */

    }, {
        key: 'listRender',
        value: function listRender(_ref3) {
            var list = _ref3.list;

            // Clear this list
            this._listFrag.innerHTML = '';
            // If data passed is empty update accordingly
            if (!list || list.length === 0) {
                var p = document.createElement('p');
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
    }, {
        key: 'infoRender',
        value: function infoRender(data) {
            var infoBar = this.$infoTmpl(data);
            // Update DOM
            this.$infoBar.innerHTML = '';
            this.$infoBar.appendChild(infoBar);
        }
    }, {
        key: 'clearInput',
        value: function clearInput() {
            this.$input.value = '';
        }
        /**
         * Changes view state 
         * @param {String} newState 
         */

    }, {
        key: 'changeViewState',
        value: function changeViewState(newState) {
            this.viewState = newState;
        }
    }]);

    return View;
}();

exports.default = View;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Takes a view and a collection and act as the controller within them
 * 
 * @constructor
 * @param {Object} view The View Instance
 * @param {Object} collection The Collection instance
 */
var Controller = function () {
    function Controller(view, collection) {
        _classCallCheck(this, Controller);

        this.view = view;
        this.collection = collection;
        // Initialize events
        this._initEvents();
        // Initial list render
        this.view.listRender({ list: [] });
    }
    /**
     * Bind all possible events on view
     */


    _createClass(Controller, [{
        key: '_initEvents',
        value: function _initEvents() {
            var _this = this;

            this.view.$input.addEventListener('keypress', function (e) {
                var val = _this.view.$input.value;
                /* Prevent empty strings */
                if (!val.trim()) {
                    return;
                }
                if (e.keyCode === 13) {
                    _this._add(val);
                }
            });
            this.view.$list.addEventListener('click', function (e) {
                var id = _this.$getId(e.target);

                if (e.target.matches('.remove')) {
                    _this._remove(id);
                } else if (e.target.matches('.toggle')) {
                    _this._update(id);
                }
            });
            this.view.$infoBar.addEventListener('click', function (e) {
                //
                if (e.target.matches('#clear')) {
                    _this._clearCompleted();
                } else if (e.target.matches('#completed')) {
                    _this._updateViewState('completed');
                } else if (e.target.matches('#active')) {
                    _this._updateViewState('active');
                } else {
                    _this._updateViewState('all');
                }
            });
        }
        /**
         * Get the parent's id of a given html element
         * 
         * @param {HTMLElement} el 
         */

    }, {
        key: '$getId',
        value: function $getId(el) {
            var item = (0, _helpers.$parent)(el, 'li');
            return String(item.dataset.id);
        }
        /**
         * Add a particular todo
         * 
         * @param {String} title 
         */

    }, {
        key: '_add',
        value: function _add(title) {
            this.collection.set('add', title);

            this._updateView();
            this.view.clearInput();
        }
        /**
         * Remove a particlar todo
         * 
         * @param {String} id 
         */

    }, {
        key: '_remove',
        value: function _remove(id) {
            this.collection.set('remove', id);
            this._updateView();
        }
        /**
         * Update a todo item
         * 
         * @param {String} id 
         */

    }, {
        key: '_update',
        value: function _update(id) {
            this.collection.set('update', id);
            this._updateView();
        }
        /**
         * Clear completed todos
         */

    }, {
        key: '_clearCompleted',
        value: function _clearCompleted() {
            this.collection.set('clearCompleted');
            this._updateView();
        }
        /**
         * Changes the value of the view state
         * @param {String} val 
         */

    }, {
        key: '_updateViewState',
        value: function _updateViewState(val) {
            this.view.changeViewState(val);
            this._updateView();
        }
        /**
         * Update the view by calling view's render functions
         */

    }, {
        key: '_updateView',
        value: function _updateView() {
            var viewState = this.view.viewState;
            var $view = this.view;
            var state = void 0;

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
    }]);

    return Controller;
}();

exports.default = Controller;

/***/ })
/******/ ]);