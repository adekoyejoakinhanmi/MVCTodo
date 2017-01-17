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
        * init ++
        * add  ++
        * remove ++
        * save --
        * find --
    * The View will manage the DOM like so -
        * init ++
        * removeEl ++
        * renderOne ++
        * renderAll
    * The Controller will glue the above by -
        * init and binding ++
    */
    var _ = document.querySelector.bind(document),
        __ = document.querySelectorAll.bind(document),
        todoList = {},
		//Source - David Walsh Blog
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
    
    function $parent(element, tagName) {
		if (!element.parentNode) {
			return;
		}
		if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
			return element.parentNode;
		}
		return $parent(element.parentNode, tagName);
	}
    
    todoList.Model = {
        init : function (data) {
            this.todos = data || [];
			this.count  = {
				active : 0
			};
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
            
            for (i = 0; i < l; i++) {
                if (id == todos[i]['id']) {
                    todos.splice(i, 1);
                    break;
                }
            }
			console.log(todos.length, id);
            PubSubMod.publish("itemRemoved", id);
        },
        toggleTodo : function (id) {
            var i,
                todos = this.todos,
                l = todos.length;
            
            for (i = 0; i < l; i += 1) {
                if (id === todos[i]['id']) {
                    todos[i]['completed'] = !todos[i]['completed'];
					console.log(todos[i]['completed']);
                    break;
                }
            }
            PubSubMod.publish("itemChanged", id);
        },
		getCount : function () {
			var todosCount = {
				active: 0,
				completed: 0,
				total: 0
			};
			var i,
                todos = this.todos,
                l = todos.length;
            
            for (i = 0; i < l; i += 1) {
				if (todos[i]['completed']) {
					todosCount.completed++;
				} else {
					todosCount.active++;
				}

				todosCount.total++;
			}
			console.log(todosCount);
			
			PubSubMod.publish("count", todosCount);
		}
    };
    
    todoList.View = {
        _templateSettings : {
            todoTmpl : '<li data-id="<%id%>">' +
                '<input type="checkbox" class="toggle" <%checked%> >' +
                '<span><%title%></span>' +
                '<div class="pull-right btns">' +
                '<i class="glyphicon glyphicon-remove remove"></i>' +
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
			this.$countNotifier = _("#countNotifier");
            
            //this.focusTodo();
        },
        renderOne : function (data) {
            /*Manually Setting value of this*/
            var self = todoList.View,
                item = self._templateSettings.show(data);
            
            if (item) {
                self.$todoList.insertBefore(htmlToDOM(item), self.$todoList.firstChild);
            }
        },
        removeEl : function (id) {
            var item = _('[data-id="' + id + '"]'),
                /*Manually Setting value of this*/
                self = todoList.View;
            self.$todoList.removeChild(item);
        },
        toggleCompleted : function (id) {
            var item = _('[data-id="' + id + '"]');
            
            item.classList.toggle("completed");
        },
        clearInput : function () {
            this.$input.value = "";
        },
        toggleNotifcation : function () {
            //console.log(this.$todoList.firstChild);
            if (this.$todoList.innerHTML !== "") {
                this.$notification.classList.add("hidden");
            } else {
                this.$notification.classList.remove("hidden");
            }
        },
		updateCount : function (values) {
			var self = todoList.View;
			if (values.active === 1) {
				self.$countNotifier.innerHTML = '1 item left';
			} else if (values.active > 1) {
				self.$countNotifier.innerHTML = values.active + " items left";
			} else {
				self.$countNotifier.innerHTML = "&nbsp;";
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
            PubSubMod.subscribe('itemRemoved', this.view.removeEl);
            PubSubMod.subscribe('itemChanged', this.view.toggleCompleted);
			
			PubSubMod.subscribe("count", this.view.updateCount);
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
            
            $on(view.$todoList, 'click', function (e) {
                var id = self._itemId(e.target);
                
                if (e.target.matches('.remove')) {
                    self._removeItem(id);
                    view.toggleNotifcation();
                } else if (e.target.matches('.toggle')) {
                    self._toggleItem(id);
                }
            });
        },
        _addItem : function (title) {
            if (title.trim() === "") {
                return;
            }
            this.model.addTodo(title);
			this.model.getCount();
        },
        _itemId : function (el) {
            var item = $parent(el, 'li');
            /*
            if (item.nodeName.toLowerCase() !== "li") {
                return;
            }*/
            return parseInt(item.dataset.id, 10);
        },
        _removeItem : function (id) {
            this.model.removeTodo(id);
			this.model.getCount();
        },
        _toggleItem : function (id) {
            this.model.toggleTodo(id);
			this.model.getCount();
        }
    };
    
    todoList.Controller.init();
    
    window.todoList = todoList;
}());
