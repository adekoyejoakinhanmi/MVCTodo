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
        todoList = {},
        PubSubMod = {
            subscribers : {},
            subscribe: function (subName, func) {
                this.subscribers[subName] = this.subscribers[subName] || [];
                this.subscribers[subName].push(func);
            },
            publish : function (subName, event) {
                var i;
                if (this.subscribers[subName]) {
                    this.subscribers[subName].forEach(function (fn) {
                        fn(event);
                    });
                }
            }
        };
    
    function htmlToDOM(html) {
        var tmpl = document.createElement('template');
        tmpl.innerHTML = html;
        return tmpl.firstChild;
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
            PubSubMod.publish("newItemAdded", this.todos.length);
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
            this.$showActive = _("#active");
            this.$countComplete = _(".completedCount");
            this.$countActive = _(".activeCount");
        },
        renderOne : function (data) {
            var item = this._templateSettings.show(data);
            this.$todoList.appendChild(htmlToDOM(item));
        }
    };
    
    todoList.Controller = {
        view : todoList.View,
        model : todoList.Model,
        init : function () {
            this.model.init();
            this.view.init();
        },
        
        addItem : function (title) {
            this.model.addTodo(title);
        }
    };
}());