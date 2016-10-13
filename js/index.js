(function () {
    'use strict';
    
    var $ = document.querySelector.bind(document),
        todos = [];
    
    function bindEvents() {
        
    }
    
    function htmlToElement(html) {
        var template = document.createElement('template');
        template.innerHTML = html;
        return template.content.firstChild;
    }
    
    
    function Model(data, collection) {
        this.data = data;
        this.save = function () {
            collection.push(this.data);
            return this;
        };
        this.toggleComplete = function () {
            this.data.completed = !this.data.completed;
            var id = collection.indexOf(this.data);
            collection.splice(id, 1, this.data);
            return this;
        };
        this.remove = function () {
            var id = collection.indexOf(this.data);
            collection.splice(id, 1);
            return this;
        };
    }
     
    function View(todo, parentEl) {
        var id = todos.indexOf[todo],
            self;
        
        this.render = function () {
            var str =  '<li data-item="<%id%>">' +
                '<span><%title%></span>' +
                '<div class="pull-right btns">' +
                '<i class="glyphicon glyphicon-remove remove"></i>' +
                '<input type="checkbox" class="toggle" <%checked%> >' +
                '</div></li>',
                
                idRE = /<%id%>/g,
                titleRE = /<%title%>/g,
                checkedRE = /<%checked%>/g;
            
            str = str.replace(idRE, id).replace(titleRE, todo.data.title).replace(checkedRE, todo.data.checked);
            
            this.el = htmlToElement(str);
            
            $("#todo-list").appendChild(this.el);
        };
        
        this.completed = function () {
            todo.com
        }
    }
}());