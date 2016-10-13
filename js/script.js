/*jslint nomen:true*/
/*global
    console, __
*/
(function () {
    'use strict';
    var TodoListApp = {},
        _ = document.querySelector.bind(document),
        __ = document.querySelectorAll.bind(document);
    
    function htmlToElement(html) {
        var template = document.createElement('template');
        template.innerHTML = html;
        return template.content.firstChild;
    }
    
    TodoListApp.Model = {
        init : function (data) {
            this.todos = data || [];
        },
        addTodo : function (title) {
            var ID = Date.now();
            
            this.todos.push({
                id : ID,
                title : title,
                completed : false
            });
        },
        find : function (query) {
            var i,
                list = this.todos,
                queries = list.filter(function (todo) {
                    if (query.completed !== todo.completed) {
                        return false;
                    }
                    return true;
                });
            
            return queries;
        },
        removeTodo : function (id) {
            var i = 0,
                l = this.todos.length;
            
            while (i < l) {
                if (this.todos[i].id === id) {
                    this.todos[i].completed = !this.todos[i].completed;
                }
            }
        },
        toggleTodo : function (id) {
            var i = 0,
                l = this.todos.length;
            
            while (i < l) {
                if (this.todos[i].id === id) {
                    this.todos[i].completed = !this.todos[i].completed;
                    break;
                }
            }
        }
    };
    
    TodoListApp.View = {
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
            this.$todoList = _('#todo-list');
            this.$showCompleted = _("#completed");
            this.$showActive  = _("#active");
            this.$input = _("#newTodo");
            this.$addBtn = _("#addTodo");
            this.$notification = _(".notification");
        },
        removeEl : function (el) {
            var item = el.parentNode.parentNode,
                parent = item.parentNode;
            
            parent.removeChild(item);
            return this;
        },
        clearInput : function () {
            this.$input.value = "";
        },
        setNotification : function (notification) {
            var p = '<div class="notification panel"><p class="text-center">' + notification + '</p></div>',
                n = this.$notification.innerHTML = p;
            this.$todoList.innerHTML = n;
        },
        render : function (query) {
            var list = TodoListApp.Controller.getTodos(query),
                html = "",
                self = this;
            
            this.$todoList.innerHTML = "";
            
            list.forEach(function (todo) {
                var item = self._templateSettings.show(todo);
                html += item;
            });
            this.$todoList.innerHTML = html;
            return this;
        }
    };
    
    TodoListApp.Controller = {
        model : TodoListApp.Model,
        view : TodoListApp.View,
        init : function () {
            this.model.init();
            this.view.init();
            this.bindEvents();
        },
        getTodos : function (query) {
            return this.model.find(query);
        },
        bindEvents : function () {
            var self = this,
                view = this.view,
                model = this.model;
            
            view.$addBtn.addEventListener('click', function (e) {
                var title = view.$input.value.trim();
                model.addTodo(title);
                view.render({completed : false});
                view.clearInput();
            });
            
            view.$todoList.addEventListener('click', function (e) {
                var el = e.target,
                    parent = el.parentNode.parentNode;
                if (el.nodeName.toLowerCase() === "i") {
                    model.removeTodo(parseInt(parent.id, 10));
                    view.removeEl(el);
                    if (view.$todoList.innerHTML === "") {
                        view.setNotification("No More Tasks, Yay!");
                    }
                } else if (el.nodeName.toLowerCase() === "input") {
                    model.toggleTodo(parseInt(parent.id, 10));
                    view.render({completed : false});
                }
            });
            
            view.$showCompleted.addEventListener('click', function () {
                var list = model.find({completed : true});
                
                if (list.length > 0) {
                    view.render({completed : true});
                } else {
                    view.setNotification("No completed Task");
                }
            });
            
            view.$showActive.addEventListener("click", function () {
                var list = model.find({completed : false});
                
                if (list.length > 0) {
                    view.render({completed : false});
                } else {
                    view.setNotification("No Current Tasks")
                }
            })
        }
    };
    
    TodoListApp.Controller.init();
    
    window.TodoList = TodoListApp;
}());