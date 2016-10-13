/*jslint nomen: true*/
(function () {
    'use strict';
    var $ = document.querySelector.bind(document),
        $$ = document.querySelectorAll.bind(document),
        $on = function (target, type, callback, useCapture) {
            target.addEventListener(type, callback, !!useCapture);
        },
        $delegate = function (target, selector, type, handler) {
            function dispatchEvent(event) {
                var targetEl = event.target,
                    potentialEl = $$(selector, target),
                    hasMatch = Array.prototype.indexOf.call(potentialEl, targetEl) >= 0;
                
                if (hasMatch) {
                    handler.call(targetEl, event);
                }
            }
            var useCapture = type === 'blur' || type === 'focus';
            
            $on(target, type, dispatchEvent, useCapture);
        },
        $parent = function (el, tagName) {
            if (!el.parentNode) {
                return;
            }
            if (el.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
                return el.parentNode;
            }
            return $parent(el.parentNode, tagName);
        };
    
    
    function Collection(data) {
        this.data = data || [];
    }
    
    Collection.prototype.save = function (obj) {
        obj.id = this.data.length += 1;
        this.data.push(obj);
    };
    
    Collection.prototype.remove = function (index) {
        var i;
        for (i = 0; i < this.data.length; i++) {
            if (this.data[i].id === index) {
                this.data.splice(i, 1);
                break;
            }
        }
    };
    
    function Model(Collection) {
        this.todos = Collection;
    }
    
    Model.prototype.create = function (title) {
        var todoTitle = title.trim(),
            newItem = {
                title : todoTitle,
                completed : false
            };
        
        this.todos.save(newItem);
    };
    
    Model.prototype.remove = function (index) {
        this.todos.remove(index);
    };
    
    function View(template) {
        this.template = template;
        
        this.$todoList = $('#todo-list');
        this.$newTodoInput = $('#newTodo');
        this.$addNewTodo = $('#addTodo');
    }
    
    View.prototype._removeItem = function (index) {
        var el = $('[data-id="' + index + '"]');
        
        if (el) {
            this.$todoList.removeChild(el);
        }
    };
    
    View.prototype._elementComplete = function (index, completed) {
        var listItem = $('[data-id="' + index + '"]');
        
        if (!listItem) {
            return;
        }
        
        listItem.className = completed ? "completed" : "";
        
        $('input', listItem).checked = completed;
    }
    
    View.prototype.render = function (viewCmd, param) {
        var self = this,
            viewCommands = {
                showEntries : function () {
                   self.$todoList.innerHTML = self.template.show(param); 
                },
                removeItem : function () {
                    self._removeItem(param);
                },
                clearNewTodo : function () {
                    self.$newTodoInput.value = "";
                },
                elementComplete : function () {
                    self._elementComplete(param.id, param.completed);
                }
            };
        viewCommands[viewCmd]();
    };
    
    View.prototype._itemId = function (el) {
        var li = $(el, "li");
        return parseInt(li.dataset.id, 10);
    };
    
    View.prototype.bind = function (event, handler) {
        var self = this;
        if (event === "newTodo") {
            $on(self.$addNewTodo, 'click', function () {
                handler(self.$newTodoInput.value);
            });
        } else if (event === "itemRemove") {
            $delegate(self.$todoList, ".remove", "click", function () {
                handler({
                    id : self._itemId(this)
                });
            });
        } else if (event === "itemToggle") {
            $delegate(self.$todoList, ".toggle", "click", function () {
                handler({
                    id : self._itemId(this),
                    completed : this.checked
                });
            });
        }
    };
    
}());