/*jslint nomen:true*/
/*global
    console, __
*/
(function () {
    'use strict';
    /*
    - How I intend for this branch to work
    - Use an EVENT system to handle events
    
    * The Model/Store will keep track of the Data with the following methods - 
        * init
        * create
        * save
        * find
    * The View will manage the DOM like so -
        * init
        * removeEl
        * renderOne
        * renderAll
    * The Controller will glue the above by -
        * init and binding
    */
    var _ = document.querySelector.bind(document),
        __ = document.querySelectorAll.bind(document),
        todoList = {},
        PubSubMod = (function () {
            var topics = {},
                hOP = topics.hasOwnProperty;

            return {
                subscribe: function (topic, listener) {
                    if (!hOP.call(topics, topic)) {
                        topics[topic] = [];
                    }
                    var index = topics[topic].push(listener) - 1;
                    
                    return {
                        remove: function () {
                            delete topics[topic][index];
                        }
                    };
                },
                publish: function (topic, info) {
                    if (!hOP.call(topics, topic)) {
                        return;
                    }
                    topics[topic].forEach(function (item) {
                        item(info !== undefined ? info : {});
                    });
                }
            };
        }());
    
    function htmlToDOM(html) {
        var tmpl = document.createElement('template');
        tmpl.innerHTML = html;
        return tmpl.content.firstChild;
    }
    
    
    function $on(el, event, fn, useCapture) {
        el.addEventListener(event, fn, !!useCapture);
    }
    
    function $delegate(el, selector, type, fn) {
        function despatchEvt(event) {
            var target = event.target,
                potentialEls = __(selector, target),
                hasMatch = Array.prototype.indexOf(potentialEls, target) >= 0;
            if (hasMatch) {
                fn.call(target, event);
            }
        }
        
        var useCapture = type === 'blur' || type === 'focus';
        $on(el, type, despatchEvt, useCapture);
    }
    
    todoList.Model = {
        init : function (data) {
            this.todos = data || [];
        },
        addTodo : function (title) {
            var newItem = {
                completed : false,
                id : Date.now(),
                title : title
            };
            
            this.todos.push(newItem);
            PubSubMod.publish("newItemAdded", newItem);
        },
        removeTodo : function (id) {
            var i,
                todos = this.todos,
                l = todos.length;
            
            for (i = 0; i < l; i += 1) {
                if (id === todos[i][id]) {
                    todos.splice(i, 1);
                    break;
                }
            }
            PubSubMod.publish("itemRemoved", {index : i, id : id});
        }
    };
    
    todoList.View = {
        _templateSettings : {
            todoTmpl : '<li id="<%id%>">' +
                '<span><%title%></span>' +
                '<div class="pull-right btns">' +
                '<i class="glyphicon glyphicon-remove remove"></i>' +
                '<input type="checkbox" class="toggle" <%checked%> >' +
                '</div></li>',
            show : function (data) {
                var valid = this.todoTmpl.replace(/<%id%>/g, data.id).replace(/<%title%>/g, data.title).replace(/<%checked%>/g, data.completed === false ? "" : 'checked');
                return valid;
            }
        },
        init : function () {
            this.$input = _("#newTodo");
            this.$todoList = _("#todo-list");
            this.$showCompleted = _("#completed");
            this.$notification = _('.notification');
            this.$showActive = _("#active");
            this.$countComplete = _(".completedCount");
            this.$countActive = _(".activeCount");
        },
        renderOne : function (data) {
            /*Manually Setting value of this*/
            var self = todoList.View,
                item = self._templateSettings.show(data);
            self.$todoList.appendChild(htmlToDOM(item));
        },
        removeEl : function (id) {
            var item = _("#" + id);
            this.$todoList.removeChild(item);
        },
        clearInput : function () {
            this.$input.value = "";
            console.log(this);
        },
        toggleNotifcation : function () {
            if (this.$notification.classList.contains('hidden')) {
                this.$notification.classList.remove("hidden");
            } else {
                this.$notification.classList.add("hidden");
            }
        }
    };
    
    todoList.Controller = {
        view : todoList.View,
        model : todoList.Model,
        init : function () {
            this.model.init();
            this.view.init();
            this.bindEvents();
            
            PubSubMod.subscribe('newItemAdded', this.view.renderOne);
        },
        bindEvents : function () {
            var view = this.view,
                model = this.model,
                self = this;
            
            $on(view.$input, 'keypress', function (e) {
                if (e.keyCode === 13) {
                    var val = view.$input.value;
                    
                    self.view.toggleNotifcation();
                    self._addItem(val);
                    view.clearInput();
                }
            });
            
            $delegate(view.$todoList, "click", ".remove", function () {
                
            });
        },
        _addItem : function (title) {
            if (title.trim() === "") {
                return;
            }
            
            this.model.addTodo(title);
        },
        _removeItem : function () {
            this.model.removeTodo();
        }
    };
    
    todoList.Controller.init();
    
    window.todoList = todoList;
}());