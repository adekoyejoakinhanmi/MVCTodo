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
	* The pubsub module is responsible for making event annoucements app-wide
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
            
            for (i = 0; i < l; i += 1) {
                if (id === todos[i].id) {
                    todos.splice(i, 1);
                    break;
                }
            }

            PubSubMod.publish("itemRemoved", id);
        },
        toggleTodo : function (id) {
            var i,
                todos = this.todos,
                l = todos.length;
            
            for (i = 0; i < l; i += 1) {
                if (id === todos[i].id) {
                    todos[i].completed = !todos[i].completed;
                    break;
                }
            }
            PubSubMod.publish("itemChanged", id);
        },
		findAll : function (query) {
			var i,
				todos = this.todos,
				l = todos.length,
				data = [];
			if (query !== "all") {
				for (i = 0; i < l; i += 1) {
					if (todos[i].completed === query.completed) {
						data.push(todos[i]);
					}
				}
			} else if (query === "all") {
				data = todos;
			}

			console.log(data);
			PubSubMod.publish("dataQueried", data);
		},
		getCount : function () {
			var todosCount = {
				active: 0,
				completed: 0,
				total: 0
			},
				i,
                todos = this.todos,
                l = todos.length;
            
            for (i = 0; i < l; i += 1) {
				if (todos[i].completed) {
					todosCount.completed += 1;
				} else {
					todosCount.active += 1;
				}

				todosCount.total += 1;
			}
			
			PubSubMod.publish("count", todosCount);
		}
    };
    
    todoList.View = {
        _templateSettings : {
            todoTmpl : '<li data-id="<%id%>" class="<%completed%>">' +
                '<input type="checkbox" class="toggle" <%checked%> >' +
                '<span><%title%></span>' +
                '<div class="pull-right btns">' +
                '<i class="glyphicon glyphicon-remove remove"></i>' +
                '</div></li>',
            show : function (data) {
                var valid = this.todoTmpl.replace(/<%id%>/g, data.id).replace(/<%title%>/g, data.title).replace(/<%checked%>/g, data.completed === false ? "" : 'checked').replace(/<%completed%>/, data.completed === false ? "" : "completed");
                return valid;
            }
        },
        init : function () {
            this.$input = _("#newTodo");
            this.$todoList = _("#todo-list");
            this.$showCompleted = _("#completed");
            this.$showActive = _("#active");
			this.$showAll = _("#all");
			this.$countNotifier = _("#countNotifier");
            this.$infoBar = _("#info-bar");
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
		renderAll : function (data) {
			var i,
				l = data.length,
				self = todoList.View;

			self.$todoList.innerHTML = "";
			for (i = 0; i < l; i += 1) {
				self.renderOne(data[i]);
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
		updateCount : function (values) {
			var self = todoList.View;

			if (values.total > 0) {
				self.$infoBar.classList.remove("hidden");
			} else {
				self.$infoBar.classList.add("hidden");
			}

			if (values.active === 1) {
				self.$countNotifier.innerHTML = '1 item left';
			} else if (values.active > 1) {
				self.$countNotifier.innerHTML = values.active + " items left";
			}
		},
		setLocation : function (location) {

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
			PubSubMod.subscribe("dataQueried", this.view.renderAll);
        },
        bindEvents : function () {
            var view = this.view,
                model = this.model,
                self = this;
            
            $on(view.$input, 'keypress', function (e) {
                if (e.keyCode === 13) {
                    var val = view.$input.value;

                    self._addItem(val);
                    view.clearInput();
                }
            });
            
            $on(view.$todoList, 'click', function (e) {
                var id = self._itemId(e.target);
                
                if (e.target.matches('.remove')) {
                    self._removeItem(id);
                } else if (e.target.matches('.toggle')) {
                    self._toggleItem(id);
                }
            });

			$on(view.$showActive, "click", function (e) {
				e.preventDefault();
				self._queryModel({completed : false});
			});

			$on(view.$showCompleted, "click", function (e) {
				e.preventDefault();
				self._queryModel({completed : true});
			});

			$on(view.$showAll, "click", function (e) {
				e.preventDefault();
				self._queryModel("all");
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
        },
		_queryModel : function (query) {
			this.model.findAll(query);
		}
    };
    
    todoList.Controller.init();
    
    window.todoList = todoList;
}());
