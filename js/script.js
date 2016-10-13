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
            PubSubMod.publish('newItemAdded', this.todos.length);
        }
    };
    
    todoList.View = {
        init : function () {
            
        }
    };
    
    todoList.Controller = {
        view : todoList.View,
        model : todoList.Model,
        init : function () {
            this.model.init();
            this.view.init();
        }
    };
}());